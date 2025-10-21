import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'daily-verse',
	name: 'Daily Verse',
	owner: 'sunnyside-up',
	version: '1.0.0',
	orientation: 'portrait',
	userInterfaceStyle: 'automatic',
	newArchEnabled: true,
	runtimeVersion: '1.0.0',
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
			foregroundImage: './assets/images/android-light.png',
			monochromeImage: './assets/images/android-dark.png',
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
		'expo-background-task',
		'expo-task-manager',
		[
			'expo-splash-screen',
			{
				android: {
					image: './assets/images/splash-icon-light.png',
					backgroundColor: '#D29EFF',
					dark: {
						image: './assets/images/splash-icon-dark.png',
						backgroundColor: '#000000',
					},
				},
				ios: {
					image: './assets/images/splash-icon-light.png',
					backgroundColor: '#D29EFF',
					dark: {
						image: './assets/images/splash-icon-dark.png',
						backgroundColor: '#000000',
					},
				},
			},
		],
	],
	sdkVersion: '53.0.0',
	// runtimeVersion: {
	// 	policy: 'appVersion',
	// },
	updates: {
		url: 'https://u.expo.dev/314ea1f7-8fd3-4748-8c27-c8b04616f6c2',
	},
});