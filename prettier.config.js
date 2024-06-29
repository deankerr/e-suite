/** @type {import("prettier").Config} */

const config = {
  semi: false,
  printWidth: 100,
  singleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<BUILTIN_MODULES>',
    '^react$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^(@/)',
    '^[.]',
    '',
    '<TYPES>',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
}

module.exports = config
