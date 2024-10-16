import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
// const config = [...fixupConfigRules(compat.extends('next/core-web-vitals', 'next/typescript'))]
const config = [...fixupConfigRules(compat.extends('next/core-web-vitals'))]

export default config
