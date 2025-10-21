import * as FileSystem from 'expo-file-system';
import { isAvailableAsync as isSharingAvailable, shareAsync, type SharingOptions } from 'expo-sharing';
import { captureScreen } from 'react-native-view-shot';

// Explicitly type the external functions to satisfy strict lint rules
const safeIsSharingAvailable: () => Promise<boolean> = (isSharingAvailable as unknown as () => Promise<boolean>);
const safeShareAsync: (url: string, options?: SharingOptions) => Promise<void> = (shareAsync as unknown as (url: string, options?: SharingOptions) => Promise<void>);
const safeCaptureScreen: (options: { format: 'png' | 'jpg'; quality: number; result: 'tmpfile' | 'base64' | 'data-uri' }) => Promise<string> = (captureScreen as unknown as (options: { format: 'png' | 'jpg'; quality: number; result: 'tmpfile' | 'base64' | 'data-uri' }) => Promise<string>);

/**
 * Captures the current screen and opens the native share sheet.
 * @param source - The source of the screenshot.
 * @returns The screenshot URI.
 */
export async function shareCurrentScreen(source: string) {
	try {
		const isShareAvailable = await safeIsSharingAvailable();
		if (!isShareAvailable) {
			// eslint-disable-next-line no-console
			console.warn('Native sharing is not available on this platform.');
			
			return;
		}

		const uri = await safeCaptureScreen({
			format: 'png',
			quality: 1,
			result: 'tmpfile',
		});

		if (!uri) {
			// eslint-disable-next-line no-console
			console.error('Failed to capture screen.');
			
			return;
		}

		// Build friendly file name, copy tmp file so share sheet shows it
		const now = new Date();
		const pad = (n: number) => n.toString().padStart(2, '0');
		// Sanitize the provided reference to a filesystem-safe, non-empty slug
		const base = (source ?? '').toString().trim().replace(/\s+/g, ' ');
		const slugRaw = base.length > 0 ? base : 'Verse';
		let slug = slugRaw.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
		if (slug.length === 0) slug = 'Verse';
		if (slug.length > 50) slug = slug.slice(0, 50);
		const filename = `Daily-Verse_${slug}_${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}.png`;
		const destUri = `${FileSystem.cacheDirectory ?? ''}${filename}`;
		let shareUri = uri;
		try {
			await FileSystem.copyAsync({ from: uri, to: destUri });
			const info = await FileSystem.getInfoAsync(destUri);
			if (info.exists) shareUri = destUri;
		} catch {
			// ignore, fall back to tmp uri
		}
		const options: SharingOptions = {
			mimeType: 'image/png',
			dialogTitle: 'Share Daily Verse',
			UTI: 'public.png',
		};
		await safeShareAsync(shareUri, options);
		// Cleanup copied file best-effort
		if (shareUri === destUri) {
			try {
				await FileSystem.deleteAsync(destUri, { idempotent: true });
			} catch {
				// ignore
			}
		}
	} catch (error) {
 		// eslint-disable-next-line no-console
		console.error('Error capturing or sharing screenshot:', error);
	}
}


