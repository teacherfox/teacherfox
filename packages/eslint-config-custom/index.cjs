/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const eslintrcConfig = {
  extends: ["turbo", "prettier"],
  ignorePatterns: ["**/dist/**"],
};

module.exports = eslintrcConfig;
