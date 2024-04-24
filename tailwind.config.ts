/** @type {import('tailwindcss').Config} */

import svgToDataUri from 'mini-svg-data-uri'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
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
    plugin(({ addUtilities }) => {
      addUtilities({
        '.flex-start': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'flex-start',
          'align-items': 'center',
        },
        '.flex-center': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.flex-end': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'flex-end',
          'align-items': 'center',
        },
        '.flex-between': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'space-between',
          'align-items': 'center',
        },
        '.flex-col-start': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-start',
          'align-items': 'center',
        },
        '.flex-col-center': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.flex-col-end': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-end',
          'align-items': 'center',
        },
        '.flex-col-between': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'space-between',
          'align-items': 'center',
        },
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
      borderColor: {
        DEFAULT: 'var(--gray-6)',
      },
      colors: {
        accent: generateRadixScale('orange'),
        gray: generateRadixScale('sand'),
        grayA: generateRadixScaleAlpha('sand'),
        orange: generateRadixScale('orange'),
        red: generateRadixScale('red'),
        green: generateRadixScale('green'),
        blue: generateRadixScale('blue'),
        yellow: generateRadixScale('yellow'),
        amber: generateRadixScale('amber'),
        gold: generateRadixScale('gold'),
        goldA: generateRadixScaleAlpha('gold'),
        bronze: generateRadixScale('bronze'),
        surface: 'var(--color-surface)',
        overlay: 'var(--color-overlay)',
        'panel-solid': 'var(--color-panel-solid)',
        'panel-translucent': 'var(--color-panel-translucent)',
      },
      containers: {
        '2xs': '16rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-jetbrains-mono)', ...fontFamily.mono],
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    // radix themes breakpoints
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
