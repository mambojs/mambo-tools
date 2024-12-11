import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ["**/build/", "**/dist/", "**/node_modules/"],
	},
	...compat.extends("eslint:recommended"),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
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

			ecmaVersion: 11,
			sourceType: "module",
		},

		rules: {
			"no-unused-vars": "warn",

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
	},
];
