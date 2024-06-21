/** @type {import('tailwindcss').Config} */

import svgToDataUri from 'mini-svg-data-uri'
import { fontFamily } from 'tailwindcss/defaultTheme'
// @ts-expect-error - flattenColorPalette file does not export a type declaration
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import plugin from 'tailwindcss/plugin'

import type { Config } from 'tailwindcss'

const radixColors = createRadixColors()

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animated'),
    require('@tailwindcss/typography'),
    // css reset
    plugin(({ addBase }) => {
      addBase({
        '*': { boxSizing: 'border-box', position: 'relative', minWidth: '0' },
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
    plugin(function ({ matchUtilities, theme }: any) {
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
          'bg-sun-large': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg viewBox="0 0 500 500" width="500" height="500" xmlns="http://www.w3.org/2000/svg"><g fill="${value}" transform="matrix(1.5624749660491943, 0, 0, 1.5624749660491943, -150.00204467773438, -145.04934692382812)"> <path d="m256 96c-35.887 0-69.012 11.812-95.703 31.766h191.4c-26.688-19.953-59.812-31.766-95.699-31.766z"/> <path d="m353.99 129.51h-195.98c-5.8789 4.5586-11.43 9.5195-16.613 14.836h229.2c-5.1836-5.3203-10.734-10.277-16.613-14.836z"/> <path d="m373.1 146.96h-234.2c-4.125 4.4258-8 9.0898-11.605 13.965h257.41c-3.6055-4.8711-7.4805-9.5352-11.605-13.965z"/> <path d="m387.21 164.42h-262.43c-2.9492 4.2188-5.7031 8.5859-8.2422 13.09h278.91c-2.5391-4.5-5.293-8.8711-8.2422-13.09z"/> <path d="m397.83 181.88h-283.66c-2.082 3.9766-4.0039 8.0547-5.7539 12.219h295.16c-1.75-4.168-3.668-8.2422-5.7539-12.219z"/> <path d="m405.68 199.33h-299.35c-1.4102 3.7188-2.6797 7.5039-3.8125 11.348h306.98c-1.1328-3.8438-2.4062-7.6289-3.8125-11.348z"/> <path d="m411.16 216.79h-310.31c-0.86719 3.4492-1.625 6.9414-2.2656 10.473h314.85c-0.64062-3.5312-1.3984-7.0234-2.2695-10.473z"/> <path d="m414.53 234.25h-317.06c-0.42969 3.1719-0.76953 6.3711-1.0156 9.6016h319.09c-0.24219-3.2305-0.58203-6.4297-1.0117-9.6016z"/> <path d="m416 256c0-1.4375-0.019531-2.8711-0.058594-4.3008h-319.88c-0.039063 1.4297-0.058594 2.8633-0.058594 4.3008 0 1.4805 0.023438 2.957 0.0625 4.4297h319.88c0.039062-1.4727 0.0625-2.9492 0.0625-4.4297z"/> <path d="m415.46 269.16h-318.93c0.21484 2.6367 0.49219 5.2539 0.83203 7.8555h317.26c0.34375-2.5977 0.62109-5.2188 0.83594-7.8555z"/> <path d="m413.07 286.61h-314.15c0.45312 2.3477 0.96094 4.6758 1.5156 6.9805h311.11c0.55859-2.3086 1.0625-4.6367 1.5195-6.9805z"/> <path d="m408.65 304.07h-305.3c0.64844 2.0547 1.332 4.0898 2.0586 6.1094h301.18c0.72656-2.0156 1.4141-4.0547 2.0625-6.1094z"/> <path d="m402.01 321.52h-292.02c0.79297 1.7617 1.6172 3.5078 2.4688 5.2383h287.08c0.85156-1.7305 1.6758-3.4766 2.4648-5.2383z"/> <path d="m392.83 338.98h-273.66c0.89453 1.4727 1.8125 2.9258 2.7539 4.3633h268.15c0.9375-1.4375 1.8555-2.8945 2.75-4.3633z"/> <path d="m380.55 356.44h-249.11c0.94922 1.1797 1.918 2.3398 2.9023 3.4922h243.3c0.98438-1.1523 1.9531-2.3164 2.9023-3.4922z"/> <path d="m364.17 373.89h-216.34c0.96484 0.88281 1.9375 1.7578 2.9219 2.6172l210.5 0.003907c0.98438-0.86328 1.957-1.7344 2.9219-2.6211z"/><path d="m341.36 391.35h-170.73c0.93359 0.58984 1.875 1.1719 2.8242 1.7461h165.08c0.94922-0.57422 1.8906-1.1562 2.8242-1.7461z"/><path d="m303.59 408.8h-95.188c0.96484 0.30078 1.9375 0.58984 2.9141 0.87109h89.359c0.97266-0.27734 1.9453-0.56641 2.9141-0.87109z"/></g></svg>`,
            )}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }),
          'bg-sun-axis-large': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><g fill="${value}" transform="matrix(1.5624630451202393, 0, 0, 1.5624630451202393, -149.99598693847656, -149.9882049560547)"><path d="m125.01 347.88 217.89-226.27c-0.19141-0.125-0.38281-0.25-0.57422-0.37109l-224.22 215.93c2.1602 3.6641 4.4648 7.2344 6.9062 10.707z"/><path d="m163.25 386.38 219.55-227.99c-0.12109-0.15625-0.23828-0.30859-0.35938-0.46484l-229.19 220.72c3.2266 2.707 6.5625 5.2891 9.9961 7.7383z"/><path d="m187.29 400.52 210.56-218.65c-0.12891-0.25-0.26172-0.49609-0.39062-0.74609l-221.59 213.38c3.7109 2.1523 7.5195 4.1602 11.414 6.0156z"/><path d="m174.84 393.9 215.93-224.22c-0.125-0.19141-0.25-0.38281-0.37109-0.57422l-226.27 217.89c3.4727 2.4414 7.043 4.7461 10.711 6.9102z"/><path d="m117.5 336.13 213.38-221.58c-0.24609-0.13281-0.49609-0.26172-0.74609-0.39062l-218.65 210.56c1.8555 3.8906 3.8633 7.6992 6.0156 11.41z"/><path d="m97.594 278.59 175.02-181.75c-0.82031-0.085938-1.6406-0.16406-2.4648-0.23438l-173.94 167.5c0.24609 4.8906 0.71094 9.7188 1.3828 14.48z"/><path d="m96.766 240.34 137.61-142.9c-1.668 0.22656-3.332 0.47656-4.9844 0.75391l-130.07 125.26c-1.1406 5.5273-1.9961 11.16-2.5547 16.883z"/><path d="m110.88 323.45 207.07-215.03c-0.32812-0.13672-0.65625-0.27344-0.98828-0.41016l-211.13 203.32c1.5195 4.1211 3.2031 8.168 5.0469 12.121z"/><path d="m256.01 416c3.6523 0 7.2773-0.125 10.871-0.36719l149.06-154.79c0.035156-1.1445 0.054688-2.2891 0.066406-3.4375l-164.61 158.52c1.5352 0.046875 3.0742 0.070313 4.6172 0.070313z"/><path d="m100.93 216.46 109.75-113.96c-2.6953 0.79297-5.3633 1.6562-7.9961 2.5898l-95.445 91.914c-2.5 6.2969-4.6094 12.793-6.3047 19.457z"/><path d="m100.76 294.85 188.23-195.46c-0.59766-0.125-1.1992-0.24609-1.8008-0.36719l-189.2 182.2c0.73047 4.6094 1.6562 9.1562 2.7695 13.625z"/><path d="m105.26 309.73 198.77-206.41c-0.44141-0.13672-0.88281-0.27344-1.3281-0.41016l-201.42 193.97c1.1484 4.3594 2.4766 8.6445 3.9766 12.852z"/><path d="m288.55 412.68 125.27-130.08c0.27734-1.6523 0.52734-3.3125 0.75391-4.9844l-142.9 137.62c5.7227-0.55859 11.355-1.4141 16.883-2.5547z"/><path d="m142.53 368.79 221.92-230.45c-0.13281-0.12109-0.26562-0.24219-0.39844-0.36719l-230.05 221.54c2.7188 3.2031 5.5625 6.2969 8.5234 9.2734z"/><path d="m133.37 358.75 220.71-229.2c-0.15625-0.12109-0.30859-0.24219-0.46484-0.35938l-227.99 219.55c2.4531 3.4414 5.0352 6.7734 7.7422 10z"/><path d="m315 404.77 91.914-95.445c0.92969-2.6328 1.793-5.3008 2.5898-7.9961l-113.96 109.75c6.6641-1.6953 13.16-3.8047 19.457-6.3047z"/><path d="m143.22 369.47c2.9766 2.9609 6.0703 5.8047 9.2734 8.5234l221.54-230.05c-0.12109-0.13281-0.24219-0.26562-0.36719-0.39844z"/><path d="m96.008 255.99c0 1.543 0.023438 3.0859 0.066407 4.6172l158.52-164.61c-1.1484 0.011718-2.2969 0.03125-3.4375 0.066406l-154.79 149.06c-0.24219 3.5938-0.36719 7.2148-0.36719 10.871z"/><path d="m134.38 152.04c-8.4609 9.8867-15.734 20.82-21.602 32.574l66.5-69.055c-7.9414 4.3516-15.477 9.3555-22.531 14.941z"/><path d="m200.68 406.17 203.32-211.13c-0.13672-0.32812-0.27344-0.66016-0.41016-0.98828l-215.03 207.07c3.957 1.8438 8 3.5273 12.121 5.0469z"/><path d="m359.97 377.62 21.539-22.367c5.5859-7.0508 10.59-14.586 14.941-22.531l-69.059 66.504c11.758-5.8711 22.688-13.145 32.578-21.605z"/><path d="m247.9 415.79 167.5-173.94c-0.070313-0.82422-0.15234-1.6445-0.23438-2.4648l-181.75 175.02c4.7617 0.67578 9.5898 1.1367 14.48 1.3828z"/><path d="m215.12 410.72 193.97-201.42c-0.13672-0.44141-0.26953-0.88672-0.41016-1.3281l-206.41 198.78c4.207 1.4961 8.4922 2.8242 12.852 3.9727z"/><path d="m217.16 411.24c4.4688 1.1172 9.0156 2.043 13.625 2.7734l182.2-189.2c-0.11719-0.60156-0.24219-1.1992-0.36719-1.8008z"/></g></svg>`,
            )}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '500px',
            backgroundAttachment: 'fixed',
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' },
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
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      maxWidth: {
        '8xl': '96rem',
      },
      keyframes: {
        shimmerDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(150%)' },
        },
        starfieldDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
      },
      animation: {
        shimmerDown: 'shimmerDown 8s linear infinite',
        starfieldDown: 'starfieldDown 20s linear infinite',
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
    accent: scale('orange-'),
    accentA: scale('orange-a'),
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
