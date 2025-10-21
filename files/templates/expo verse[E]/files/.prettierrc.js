module.exports = {
	printWidth: 80,
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
	plugins: ['prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: ['**/*.{json,jsonc,json5}', '*.{json,jsonc,json5}'],
			options: {
				useTabs: true
			}
		}
	]
};