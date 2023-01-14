/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const eslintrcConfig = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};

module.exports = eslintrcConfig;
