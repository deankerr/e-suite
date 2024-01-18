/** @type {import('tailwindcss').Config} */

import radixThemePlugin from 'radix-ui-themes-with-tailwind'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    radixThemePlugin({
      useTailwindColorNames: false,
      useTailwindRadiusNames: false,
      mapMissingTailwindColors: false,
    }),
    // css reset
    plugin(({ addBase }) => {
      addBase({
        '*': { boxSizing: 'border-box', position: 'relative', minWidth: '0' },
        body: { minHeight: '100dvh' },
        h1: { textWrap: 'balance' },
        h2: { textWrap: 'balance' },
        h3: { textWrap: 'balance' },
        h4: { textWrap: 'balance' },
        p: { textWrap: 'pretty' },
      })
    }),
    // main grid stacked pile layout
    plugin(({ addComponents }) => {
      addComponents({
        '.grid-pile': {
          display: 'grid',
          'place-content': 'center',
          '&>*': { gridArea: '1 / 1' },
        },
      })
    }),
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'var(--gray-5)',
      },
    },
    screens: {
      xs: '520px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1640px',
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: 'calc(0.125rem * var(--scaling))',
      1: 'calc(0.25rem * var(--scaling))',
      1.5: 'calc(0.375rem * var(--scaling))',
      2: 'calc(0.5rem * var(--scaling))',
      2.5: 'calc(0.625rem * var(--scaling))',
      3: 'calc(0.75rem * var(--scaling))',
      3.5: 'calc(0.875rem * var(--scaling))',
      4: 'calc(1rem * var(--scaling))',
      5: 'calc(1.25rem * var(--scaling))',
      6: 'calc(1.5rem * var(--scaling))',
      7: 'calc(1.75rem * var(--scaling))',
      8: 'calc(2rem * var(--scaling))',
      9: 'calc(2.25rem * var(--scaling))',
      10: 'calc(2.5rem * var(--scaling))',
      11: 'calc(2.75rem * var(--scaling))',
      12: 'calc(3rem * var(--scaling))',
      14: 'calc(3.5rem * var(--scaling))',
      16: 'calc(4rem * var(--scaling))',
      20: 'calc(5rem * var(--scaling))',
      24: 'calc(6rem * var(--scaling))',
      28: 'calc(7rem * var(--scaling))',
      32: 'calc(8rem * var(--scaling))',
      36: 'calc(9rem * var(--scaling))',
      40: 'calc(10rem * var(--scaling))',
      44: 'calc(11rem * var(--scaling))',
      48: 'calc(12rem * var(--scaling))',
      52: 'calc(13rem * var(--scaling))',
      56: 'calc(14rem * var(--scaling))',
      60: 'calc(15rem * var(--scaling))',
      64: 'calc(16rem * var(--scaling))',
      72: 'calc(18rem * var(--scaling))',
      80: 'calc(20rem * var(--scaling))',
      96: 'calc(24rem * var(--scaling))',
      'rx-1': 'var(--space-1)',
      'rx-2': 'var(--space-2)',
      'rx-3': 'var(--space-3)',
      'rx-4': 'var(--space-4)',
      'rx-5': 'var(--space-5)',
      'rx-6': 'var(--space-6)',
      'rx-7': 'var(--space-7)',
      'rx-8': 'var(--space-8)',
      'rx-9': 'var(--space-9)',
    },
  },
}

export default config
