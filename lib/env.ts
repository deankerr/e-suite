import z from 'zod'
import { AppError } from './error'

const schema = {
  // app
  APP_NAME: 'string',
  APP_SITE_URL: 'string',
  APP_API_AUTH_TOKENS: 'list',

  // database
  LIBSQL_DATABASE_URL: 'string',
  LIBSQL_DATABASE_AUTH_TOKEN: 'string',
  POSTGRES_POOLED_DATABASE_URL: 'string',
  POSTGRES_DIRECT_DATABASE_URL: 'string',

  // auth
  KINDE_CLIENT_ID: 'string',
  KINDE_CLIENT_SECRET: 'string',
  KINDE_ISSUER_URL: 'string',
  KINDE_SITE_URL: 'string',
  KINDE_POST_LOGOUT_REDIRECT_URL: 'string',
  KINDE_POST_LOGIN_REDIRECT_URL: 'string',
  KINDE_AUDIENCE: 'string',

  // ai vendor
  OPENAI_API_KEY: 'string',
  OPENROUTER_API_KEY: 'string',
  TOGETHERAI_API_KEY: 'string',
  REPLICATE_API_KEY: 'string',
  ELEVENLABS_API_KEY: 'string',
  FALAI_API_KEY: 'string',
} as const

type ToEnv<S extends typeof schema> = {
  [P in keyof S]: S[P] extends 'string' ? string : string[]
}

type Env = ToEnv<typeof schema>

function parseEnv<T extends object>(schema: T): Env {
  try {
    const parsed = {} as any

    for (const [k, spec] of Object.entries(schema)) {
      const envVar = process.env[k]
      const key = k as keyof Env

      if (spec === 'string') {
        parsed[key] = z.string().parse(envVar)
      }

      if (spec === 'list') {
        const json = JSON.parse(z.string().parse(envVar))
        const array = z.string().array().parse(json)
        parsed[key] = Object.freeze(array)
      }
    }

    return Object.freeze(parsed)
  } catch (err) {
    throw new AppError('internal', 'Invalid configuration', err)
  }
}

export const ENV = parseEnv(schema)
