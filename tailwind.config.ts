/** @type {import('tailwindcss').Config} */

import svgToDataUri from 'mini-svg-data-uri'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
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
    plugin(function ({ matchUtilities }) {
      matchUtilities(
        {
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        { type: 'any' },
      )
    }),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // fontFamily: {
      //   fantasque: ['var(--font-fantasque-sans-mono)'],
      //   manrope: ['var(--font-manrope)'],
      //   merriweather: ['var(--font-merriweather)'],
      // },
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
        // accent: {
        //   DEFAULT: 'hsl(var(--accent))',
        //   foreground: 'hsl(var(--accent-foreground))',
        // },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        accent: generateRadixScale('orange'),
        gray: generateRadixScale('gray'),
        grayA: generateRadixScaleAlpha('gray'),

        orange: generateRadixScale('orange'),
        red: generateRadixScale('red'),
        green: generateRadixScale('green'),
        blue: generateRadixScale('blue'),
        yellow: generateRadixScale('yellow'),
        amber: generateRadixScale('amber'),
        gold: generateRadixScale('gold'),
        bronze: generateRadixScale('bronze'),
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
  },
}

export default config

function generateRadixScale(name: string) {
  return Object.fromEntries(
    Array.from({ length: 12 }).map((_, i) => [i + 1, `var(--${name}-${i + 1})`]),
  )
}

function generateRadixScaleAlpha(name: string) {
  return Object.fromEntries(
    Array.from({ length: 12 }).map((_, i) => [i + 1, `var(--${name}-a${i + 1})`]),
  )
}
