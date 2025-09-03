import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'daily-verse',
	name: 'Daily Verse',
	owner: 'sunnyside-up',
	version: '1.0.0',
	orientation: 'portrait',
	userInterfaceStyle: 'automatic',
	icon: './assets/images/icon.png',
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'so.sunnysideup.daily-verse',
		config: {
			usesNonExemptEncryption: false,
		},
		icon: {
			dark: './assets/images/ios-dark.png',
			light: './assets/images/ios-light.png',
			tinted: './assets/images/ios-tinted.png',
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			monochromeImage: './assets/images/adaptive-icon.png',
			// backgroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: '#ffffff',
		},
		edgeToEdgeEnabled: true,
		package: 'so.sunnysideup.daily_verse',
	},
	web: {
		favicon: './assets/favicon.png',
		bundler: 'metro',
	},
	extra: {
		eas: {
			projectId: 'ce2e3d56-e924-46a0-a880-f9f9911558eb',
		},
	},
	plugins: [
		'expo-localization',
		'expo-asset',
		'expo-font',
		[
			'expo-splash-screen',
			{
				image: './assets/images/splash-icon-dark.png',
				imageWith: 200,
				resizeMode: 'contain',
				backgroundColor: '#ffffff',
                dark: {
                    image: './assets/images/splash-icon-light.png',
                    backgroundColor: '#000000',
                },
			},
		],
	],
	sdkVersion: '53.0.0',
	runtimeVersion: {
		policy: 'appVersion',
	},
	updates: {
		url: 'https://u.expo.dev/314ea1f7-8fd3-4748-8c27-c8b04616f6c2',
	},
});