/** @type {import('tailwindcss').Config} */

import radixThemePlugin from 'radix-ui-themes-with-tailwind'
import type { Config } from 'tailwindcss'

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
  ],
}

export default config
