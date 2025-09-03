module.exports = function(api) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	api.cache(true);

	return {
		presets: [['babel-preset-expo', {
			jsxImportSource: 'nativewind'
		}], 'nativewind/babel'],
	};
};