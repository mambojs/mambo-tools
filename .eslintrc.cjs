module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 11,
	},
	rules: {
		indent: [
			"error",
			"tab",
			{
				SwitchCase: 1,
				ignoredNodes: ["ConditionalExpression"],
			},
		],
		"linebreak-style": ["error", "windows"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
