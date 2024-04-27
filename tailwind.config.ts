/** @type {import('tailwindcss').Config} */

import svgToDataUri from 'mini-svg-data-uri'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

const radixColors = createRadixColors()

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animated'),
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
        ...radixColors,
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
      maxWidth: {
        '8xl': '96rem',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s ease-in-out infinite',
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

function createRadixColors() {
  const scale = (key: string) =>
    Object.fromEntries([...Array(12)].map((_, i) => [i + 1, `var(--${key}${i + 1})`]))

  return {
    gray: scale('sand-'),
    grayA: scale('sand-a'),
    gold: scale('gold-'),
    goldA: scale('gold-a'),
    bronze: scale('bronze-'),
    bronzeA: scale('bronze-a'),
    brown: scale('brown-'),
    brownA: scale('brown-a'),
    yellow: scale('yellow-'),
    yellowA: scale('yellow-a'),
    amber: scale('amber-'),
    amberA: scale('amber-a'),
    orange: scale('orange-'),
    orangeA: scale('orange-a'),
    tomato: scale('tomato-'),
    tomatoA: scale('tomato-a'),
    red: scale('red-'),
    redA: scale('red-a'),
    ruby: scale('ruby-'),
    rubyA: scale('ruby-a'),
    crimson: scale('crimson-'),
    crimsonA: scale('crimson-a'),
    pink: scale('pink-'),
    pinkA: scale('pink-a'),
    plum: scale('plum-'),
    plumA: scale('plum-a'),
    purple: scale('purple-'),
    purpleA: scale('purple-a'),
    violet: scale('violet-'),
    violetA: scale('violet-a'),
    iris: scale('iris-'),
    irisA: scale('iris-a'),
    indigo: scale('indigo-'),
    indigoA: scale('indigo-a'),
    blue: scale('blue-'),
    blueA: scale('blue-a'),
    cyan: scale('cyan-'),
    cyanA: scale('cyan-a'),
    teal: scale('teal-'),
    tealA: scale('teal-a'),
    jade: scale('jade-'),
    jadeA: scale('jade-a'),
    green: scale('green-'),
    greenA: scale('green-a'),
    grass: scale('grass-'),
    grassA: scale('grass-a'),
    lime: scale('lime-'),
    limeA: scale('lime-a'),
    mint: scale('mint-'),
    mintA: scale('mint-a'),
    sky: scale('sky-'),
    skyA: scale('sky-a'),
  }
}
