/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const eslintrcConfig = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ["dist/**/*"],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
};

module.exports = eslintrcConfig;
