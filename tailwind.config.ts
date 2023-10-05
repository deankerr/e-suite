import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#1dcdbc', //65c3c8
          secondary: '#FFA17A',
          accent: '#0091CC', // '#F3EADA', //'#B08FEB',
          neutral: '#2a323c',
          'base-100': '#1d232a',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
      {
        mytheme2: {
          primary: '#008F84', //65c3c8
          secondary: '#FFA17A',
          accent: '#0091CC', // '#F3EADA', //'#B08FEB',
          neutral: '#2a323c',
          'base-100': '#1d232a',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
    ],
  },
}
export default config
