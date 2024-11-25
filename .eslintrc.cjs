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
		"no-unused-vars": "off",
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
	globals: {
		marked: true,
		object: true,
		dom: true,
		tools: true,
		mamboTools: true,
		mamboUI: true,
		domJS: true,
		router: true,
		ui: true,
		PR: true,
		installStoryboard: true,
	},
};
