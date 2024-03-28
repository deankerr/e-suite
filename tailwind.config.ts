/** @type {import('tailwindcss').Config} */

import radixThemePlugin from 'radix-ui-themes-with-tailwind'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    radixThemePlugin({
      useTailwindColorNames: false,
      useTailwindRadiusNames: false,
      mapMissingTailwindColors: false,
    }),
    // css reset
    plugin(({ addBase }) => {
      addBase({
        '*': { boxSizing: 'border-box', position: 'relative', minWidth: '0' },
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
          '&>*': { gridArea: '1 / 1' },
        },
      })
    }),
    // radix-ui Card border customization (use css color vars)
    plugin(function ({ matchUtilities }) {
      matchUtilities(
        {
          'card-border': (value: string) => ({
            'box-shadow': `0 0 0 1px var(--${value});`,
            '@supports (box-shadow: 0 0 0 1px color-mix(in oklab, white, black))': {
              'box-shadow': `0 0 0 1px color-mix(in oklab, var(--${colorToAlpha(
                value,
              )}), var(--${value}) 25%);`,
            },
          }),
        },
        { type: 'any' },
      )
    }),
  ],
  theme: {
    extend: {
      // start shadcn-ui
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      // end shadcn-ui
      borderColor: {
        DEFAULT: 'var(--gray-5)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        wipeDown: {
          from: { top: '-4rem', opacity: '1' },
          to: { top: 'calc(100% + 4rem)', opacity: '1' },
        },
        // start shadcn-ui
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // end shadcn-ui
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        wipedown: 'wipeDown 1.75s linear infinite',
        // start shadcn-ui
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // end shadcn-ui
      },
      containers: {
        '2xs': '16rem',
      },
    },
    // start shadcn-ui
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    // end shadcn-ui
    screens: {
      sm: '520px', // Phones (landscape)
      md: '768px', // Tablets (portrait)
      lg: '1024px', // Tablets (landscape)
      xl: '1280px', // Laptops
      '2xl': '1640px', // Desktops
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

const colorToAlpha = (rxColor: string) => {
  const split = rxColor.split('-')
  const name = split[0]
  const num = split[1]
  if (!name || !num) return rxColor
  return `${name}-a${num}`
}

export default config
