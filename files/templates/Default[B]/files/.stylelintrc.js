module.exports = {
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      customSyntax: "@stylelint/postcss-css-in-js",
    },
  ],
};