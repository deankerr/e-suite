import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'

export const GET = handleAuth() as (...args: any) => any
