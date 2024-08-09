import * as vb from 'valibot'

const schema = vb.object({
  APP_HOSTNAME: vb.string(),
  CLERK_JWT_ISSUER_DOMAIN: vb.string(),
  CLERK_WEBHOOK_SECRET: vb.string(),
  // * endpoint keys
  AWS_ACCESS_KEY_ID: vb.string(),
  AWS_SECRET_ACCESS_KEY: vb.string(),
  ELEVENLABS_API_KEY: vb.string(),
  FAL_API_KEY: vb.string(),
  OPENAI_API_KEY: vb.string(),
  OPENROUTER_API_KEY: vb.string(),
  SINKIN_API_KEY: vb.string(),
  TOGETHER_API_KEY: vb.string(),
})

export const ENV = vb.parse(schema, process.env)
