/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/preline/preline.js',
  ],
  plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
  theme: {
    extend: {
      colors: {
        shell: '#0c0a09',
        p: colors.orange,
        n: colors.stone,
      },
    },
  },
}

export default config
