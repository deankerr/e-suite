/** @type {import('tailwindcss').Config} */

import BaseConfig from '../tailwind.config'

BaseConfig.content = [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  '../components/**/*.{ts,tsx}',
]

export default BaseConfig
