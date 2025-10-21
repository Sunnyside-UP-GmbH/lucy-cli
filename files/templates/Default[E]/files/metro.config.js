/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const ALIASES_WEB = {
	'@wix/sdk': path.resolve(__dirname, './node_modules/@wix/sdk/cjs/build/index.js'),
	// Example: redirect imports of 'some-native-library' to a web-compatible mock
	// 'some-native-library': path.resolve(__dirname, 'src/mocks/some-native-library.web.js'),

	// You can add your @wix/sdk aliases here if needed
	// '@wix/sdk-something': path.resolve(__dirname, 'src/wix/sdk-something-web.js'),
};
const config = (() => {
	let config = getDefaultConfig(__dirname);
	const { transformer, resolver } = config;
	config.transformer = {
		...transformer,
	};
	
	const assetExts = config.resolver.assetExts;
	if (!assetExts.includes('csv')) {
		assetExts.push('csv');
	}

	config.resolver = {
		...resolver,
	};
	
	config.resolver.unstable_enablePackageExports = false;
	// config.resolver.unstable_conditionsByPlatform = ['ios', 'android']
config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (platform === 'web') {
		// Check if the module name is in our alias map
		const alias = ALIASES_WEB[moduleName];
		if (alias) {
			console.log(`Aliasing '${moduleName}' to '${alias}'`);
			// If it is, resolve to the new path
			return context.resolveRequest(context, alias, platform);
		}
	}
	// Ensure you call the default resolver for everything else.
	return context.resolveRequest(context, moduleName, platform);
};

	config.resolver.extraNodeModules = {
		...config.resolver.extraNodeModules,
		...require('node-libs-react-native'),
		// 'node:buffer': require.resolve('buffer/'),
		// 'node:crypto': require.resolve('react-native-crypto/'),
		// 'node:util': require.resolve('util/'),
		// 'node:http': require.resolve('stream-http/'),
		// 'node:https': require.resolve('https-browserify/'),
		// 'node:events': require.resolve('events/'),
	};
	
	return config;
})();
// console.log('Using Metro config:', JSON.stringify(config, null, 2));
module.exports = withNativeWind(config, { input: './global.css' });

