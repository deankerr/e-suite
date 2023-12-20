/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/preline/preline.js',
  ],
  plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
}

export default config
