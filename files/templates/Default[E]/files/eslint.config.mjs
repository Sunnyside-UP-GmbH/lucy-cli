/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://docs.expo.dev/guides/using-eslint/
import eslint from '@eslint/js';
import expoConfig from 'eslint-config-expo/flat.js';
// @ts-ignore
import jsdoc from 'eslint-plugin-jsdoc';
import namedImportSpacing from 'eslint-plugin-named-import-spacing';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	// eslint-disable-next-line import/no-named-as-default-member
	tseslint.configs.recommendedTypeChecked,
	jsdoc.configs['flat/recommended-typescript'],
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	expoConfig,
	{
		ignores: ['dist/*'],
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			'named-import-spacing': namedImportSpacing,
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				}
			}
		},
		languageOptions: {
			// eslint-disable-next-line import/no-named-as-default-member
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
			},
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				$w: 'readonly',
				...globals.browser,
				...globals.node,
				// ...globals.es6,
			},
		},
		rules: {
			'no-console': ['error'],
			'no-restricted-imports': [
				'error',
				{
					'patterns': ['*/**/backend/*', '*/**/public/*']
				}
			],
			'no-restricted-syntax': [
				'warn',
				{
					selector: 'StaticBlock',
					message: 'Static blocks are not allowed in classes.',
				},
				{
					selector: "MemberExpression[object.name='globalThis'][property.name='console']",
					message: 'Using globalThis.console is not allowed.'
				},
				{
					selector: "CallExpression[callee.property.name='runPromise'][callee.object.name='runtime']",
					message: 'Usage of runtime.runPromise() is discouraged.',
				},
				{
					selector: "CallExpression[callee.property.name='runFork'][callee.object.name='runtime']",
					message: 'Usage of runtime.runFork() is discouraged.',
				}
			],
			'@typescript-eslint/no-unsafe-argument': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'error',
			quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
			curly: ['error', 'multi-line'],
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			indent: ['error', 'tab'],
			'no-tabs': 0,
			'semi-style': ['error', 'last'],
			semi: [2, 'always'],
			'object-curly-spacing': ['error', 'always'],
			'space-in-parens': ['error', 'never'],
			'newline-before-return': 'error',
			'space-before-blocks': ['error', { functions: 'always', keywords: 'always', classes: 'always' }],
			'comma-spacing': ['error', { before: false, after: true }],
			'no-multi-spaces': 'error',
			'import/newline-after-import': ['error', { count: 1 }],
			'named-import-spacing/named-import-spacing': 2,
			'@typescript-eslint/no-unused-vars': 'warn',
			'import/no-unresolved': [0],
			'no-forbidden-relative-imports': [0],
			'@typescript-eslint/triple-slash-reference': 'off',
			'@typescript-eslint/member-ordering': [
				'error',
				{
					classes: [
						'constructor',
						'private-instance-field',
						'protected-instance-field',
						'public-instance-field',
						'public-instance-method',
						'private-instance-method',
					],
				},
			],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: ['variable'],
					format: ['camelCase', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
				},
				{
					selector: ['function'],
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: ['objectLiteralMethod',],
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: ['import',],
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: ['objectLiteralProperty'],
					format: null,
					leadingUnderscore: 'allow',
				},
				{
					selector: 'memberLike',
					modifiers: ['private'],
					format: ['camelCase'],
					leadingUnderscore: 'require',
				},
				{
					selector: 'memberLike',
					modifiers: ['protected'],
					format: ['camelCase'],
					leadingUnderscore: 'require',
				},
				{
					selector: 'memberLike',
					modifiers: ['public'],
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: ['parameterProperty', 'parameter'],
					format: ['camelCase'],
					leadingUnderscore: 'forbid',
				},
				{
					selector: 'default',
					format: ['UPPER_CASE'],
					leadingUnderscore: 'forbid',
					trailingUnderscore: 'forbid',
					custom: {
						regex: '^[A-Z_]+$',
						match: true,
					},
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
			],
		},
	},
);
