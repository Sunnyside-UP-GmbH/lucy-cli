import fs, { type Dirent } from 'fs';
import path from 'path';

const ROOT_DIR: string = path.resolve(__dirname, '..');
const BUILD_DIR: string = path.join(ROOT_DIR, 'build');
const EXTENSIONS: Set<string> = new Set(['.ipa', '.aab', '.apk', '.tar']);
const RECENT_WINDOW_MS: number = 30 * 60 * 1000; // 30 minutes

/**
 * Ensure build directory exists.
 */
function ensureBuildDir(): void {
	if (!fs.existsSync(BUILD_DIR)) {
		fs.mkdirSync(BUILD_DIR, { recursive: true });
	}
}

/**
 * Determine if a file name represents an artifact we want to move.
 * @param fileName The file name to check.
 * @returns True if file is an artifact.
 */
function isArtifact(fileName: string): boolean {
	const lower = fileName.toLowerCase();
	if (lower.endsWith('.tar.gz')) {
		
		return true;
	}
	const ext = path.extname(lower);
	
	return EXTENSIONS.has(ext);
}

/**
 * Move artifacts modified within a recent time window into build/.
 */
function moveRecentArtifacts(): void {
	const now = Date.now();
	const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
	const candidates = entries
		.filter((d: Dirent) => d.isFile() && isArtifact(d.name))
		.map((d: Dirent) => path.join(ROOT_DIR, d.name))
		.filter((full: string) => {
			try {
				const stat = fs.statSync(full);
				
				return now - stat.mtimeMs <= RECENT_WINDOW_MS;
			} catch {
				
				return false;
			}
		});

	if (candidates.length === 0) {
		// eslint-disable-next-line no-console
		console.log('No recent artifacts to move.');
		
		return;
	}

	for (const src of candidates) {
		const dest = path.join(BUILD_DIR, path.basename(src));
		try {
			fs.renameSync(src, dest);
			// eslint-disable-next-line no-console
			console.log(`Moved: ${path.basename(src)} -> build/${path.basename(dest)}`);
		} catch (err) {
			const message = err && typeof err === 'object' && 'message' in err ? String((err as Error).message) : String(err);
			// eslint-disable-next-line no-console
			console.warn(`Failed to move ${src}:`, message);
		}
	}
}

/**
 * Entrypoint.
 */
function main(): void {
	ensureBuildDir();
	moveRecentArtifacts();
}

main();
