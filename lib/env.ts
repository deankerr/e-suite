/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import z, { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
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
  KINDE_AUDIENCE: 'string',

  // KINDE_SITE_URL, KINDE_POST_LOGOUT_REDIRECT_URL, KINDE_POST_LOGIN_REDIRECT_URL
  // populated dynamically, won't always be present on process.env

  // ai vendor
  OPENAI_API_KEY: 'string',
  OPENROUTER_API_KEY: 'string',
  TOGETHERAI_API_KEY: 'string',
  REPLICATE_API_KEY: 'string',
  ELEVENLABS_API_KEY: 'string',
  FALAI_API_KEY: 'string',
  HUGGING_FACE_API_KEY: 'string',
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
        const val = z.string().safeParse(envVar)
        if (!val.success) {
          throw new AppError('invalid_configuration', {
            cause: {
              env: key,
              required: 'string',
              received: typeof envVar,
            },
          })
        }
        parsed[key] = val.data
      }

      if (spec === 'list') {
        const arrayParser = z.string().transform((val) => {
          return z.string().array().parse(JSON.parse(val))
        })
        const val = arrayParser.safeParse(envVar)
        if (!val.success) {
          throw new AppError('invalid_configuration', {
            cause: {
              env: key,
              required: 'list',
              received: typeof envVar,
            },
          })
        }
        parsed[key] = Object.freeze(val.data)
      }
    }

    return Object.freeze(parsed)
  } catch (err) {
    if (err instanceof AppError) throw err

    if (err instanceof ZodError) {
      const zErr = fromZodError(err)
      throw new AppError('invalid_configuration', { cause: zErr })
    }

    throw new AppError('invalid_configuration', { cause: err })
  }
}

export const ENV = parseEnv(schema)
