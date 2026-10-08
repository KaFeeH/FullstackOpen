import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    plugins: { js, stylistic },
    extends: ["js/recommended"],
    rules: {
      eqeqeq: "error",
      "stylistic/no-trailing-spaces": "error",
      "stylistic/object-curly-spacing": ["error", "always"],
      "stylistic/arrow-spacing": ["error", { before: true, after: true }],
      "stylistic/semi": ["error", "always"],
      "stylistic/space-infix-ops": "error",
      "stylistic/eol-last": ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  globalIgnores(["./dist/**"]),
]);
