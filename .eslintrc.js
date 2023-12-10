// eslint-disable-next-line unicorn/prefer-module
module.exports = {
	root: true,
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		project: "tsconfig.json",
		// eslint-disable-next-line unicorn/prefer-module
		tsconfigRootDir: __dirname,
		sourceType: "module",
		parser: "@typescript-eslint/parser",
	},
	settings: {
		root: true,
		react: {
			version: "detect",
		},
	},
	plugins: ["@typescript-eslint", "@typescript-eslint/eslint-plugin"],
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["./shop-shared/.eslintrc.base.js", "./shop-shared/.eslintrc.next.js"],
};
