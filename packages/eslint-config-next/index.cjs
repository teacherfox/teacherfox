/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const eslintrcConfig = {
  extends: ["custom", "next"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};

module.exports = eslintrcConfig;
