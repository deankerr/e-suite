/* eslint-env node */

module.exports = {
  extends: ['next/core-web-vitals'],
}

// module.exports = {
//   root: true,
//   extends: ['next/core-web-vitals'],
//   ignorePatterns: ['convex/_generated'],
//   reportUnusedDisableDirectives: true,
//   rules: {
//     // // downgrade unused/let vars to warning
//     // '@typescript-eslint/no-unused-vars': [
//     //   'warn',
//     //   { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
//     // ],
//     'prefer-const': 'warn',

//     // allow any during dev
//     // '@typescript-eslint/no-explicit-any': 'off',
//     // '@typescript-eslint/no-unsafe-argument': 'off',
//     // '@typescript-eslint/no-unsafe-assignment': 'off',
//     // '@typescript-eslint/no-unsafe-call': 'off',
//     // '@typescript-eslint/no-unsafe-member-access': 'off',
//     // '@typescript-eslint/no-unsafe-return': 'off',

//     // thanks vercel
//     '@next/next/no-img-element': 'off',
//   },
// }
