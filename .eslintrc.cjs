module.exports = {
  root: true,
  extends: ['plugin:@typescript-eslint/recommended-type-checked', 'next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'es2022',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    warnOnUnsupportedTypeScriptVersion: true,
    project: true,
  },
  ignorePatterns: ['.next', 'unused'],
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
    // convex support
    '@typescript-eslint/require-await': 'off',
    // thanks vercel
    '@next/next/no-img-element': 'off',
    // very slow
    '@typescript-eslint/no-misused-promises': 'off',
  },
}
