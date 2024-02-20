/* eslint-env node */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['convex/_generated', '.next', 'unused', 'cosmos-export'],
  rules: {
    // support unused vars during dev
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    // allow any during dev
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    // allow {} during dev (empty react props)
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { '{}': false },
        extendDefaults: true,
      },
    ],
    // thanks vercel
    '@next/next/no-img-element': 'off',

    // type checked
    //'@typescript-eslint/require-await': 'off', // convex support
    //'@typescript-eslint/no-misused-promises': 'off',
  },
}
