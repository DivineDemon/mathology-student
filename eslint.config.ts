import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import checkFile from "eslint-plugin-check-file";
import nodePlugin from "eslint-plugin-n";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config({ ignores: ["dist"] }, prettierConfig, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "check-file": checkFile,
    n: nodePlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "error", // Upgraded from 'warn' to 'error' to match .eslintrc.json
      { allowConstantExport: true },
    ],
    "prefer-arrow-callback": ["error"],
    "prefer-template": ["error"],
    semi: ["error"],
    quotes: ["error", "double"],
    "n/no-process-env": ["error"],
    "check-file/filename-naming-convention": [
      "error",
      {
        "**/*.{ts,tsx}": "KEBAB_CASE",
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    "check-file/folder-naming-convention": [
      "error",
      {
        "src/**/!^[.*": "KEBAB_CASE",
      },
    ],
  },
});
