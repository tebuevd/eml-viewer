module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:perfectionist/recommended-natural",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts", "crate"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	plugins: ["@typescript-eslint", "react-refresh", "perfectionist"],
	rules: {
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
	},
};
