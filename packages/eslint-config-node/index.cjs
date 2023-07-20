/** @type {import("@typescript-eslint/utils").TSESLint.Linter.Config} */
const eslintrcConfig = {
  extends: ["custom", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off"
  }
};

module.exports = eslintrcConfig;
