/** @type {import('tailwindcss').Config} */

import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/preline/preline.js',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('preline/plugin'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shell: '#0c0a09',
        p: colors.orange,
        n: colors.zinc,
        prima: 'hsl(var(--prima))',
      },
    },
  },
}

export default config

/* tint1
{
  "colors": {
    "brand": {
      50: "#FFB8BE",
      100: "#FFAAA8",
      200: "#FF8E80",
      300: "#FF7F5C",
      400: "#FF7433",
      500: "#F97315",
      600: "#D64400",
      700: "#A32300",
      800: "#6B0C00",
      900: "#380100",
      950: "#190002"
    }
  }
}

*/

/* tint2
{
  "colors": {
    "brand": {
      50: "#FAEBF1",
      100: "#F7D9E0",
      200: "#F2ABB1",
      300: "#F1877E",
      400: "#F1744B",
      500: "#F97315",
      600: "#C73D0F",
      700: "#941B10",
      800: "#5D0E15",
      900: "#2F0913",
      950: "#14050B"
    }
  }
}

*/
