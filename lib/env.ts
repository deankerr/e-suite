import { parseEnv, z } from 'znv'

const schema = {
  // app
  APP_NAME: z.string(),
  APP_SITE_URL: z.string(),

  // database
  LIBSQL_DATABASE_URL: z.string(),
  LIBSQL_DATABASE_AUTH_TOKEN: z.string(),
  POSTGRES_POOLED_DATABASE_URL: z.string(),
  POSTGRES_DIRECT_DATABASE_URL: z.string(),

  // auth
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_ISSUER_URL: z.string(),
  KINDE_SITE_URL: z.string(),
  KINDE_POST_LOGOUT_REDIRECT_URL: z.string(),
  KINDE_POST_LOGIN_REDIRECT_URL: z.string(),
  KINDE_AUDIENCE: z.string(),

  // ai vendor
  OPENAI_API_KEY: z.string(),
  OPENROUTER_API_KEY: z.string(),
  TOGETHERAI_API_KEY: z.string(),
  REPLICATE_API_KEY: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  FALAI_API_KEY: z.string(),
}

export const ENV = parseEnv(process.env, schema)
