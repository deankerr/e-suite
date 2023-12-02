import 'server-only'
import { ENV } from '@/lib/env'
import { AppError } from '@/lib/error'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export type UserSession = Awaited<ReturnType<typeof getUserSession>>

export async function getUserSession() {
  const { getUser, getPermissions } = getKindeServerSession()

  const kindeUser = await getUser()
  const kindePermissions = await getPermissions()

  if (!kindeUser || !kindePermissions)
    throw new AppError('unauthorized', 'You are not logged in.', {
      kindeUser,
      kindePermissions,
    })

  const userSession = {
    id: kindeUser.id,
    email: kindeUser.email,
    firstName: kindeUser.given_name,
    lastName: kindeUser.family_name,
    image: kindeUser.picture,
    permissions: kindePermissions.permissions,
  }

  return userSession
}

export async function getIsAuthenticated() {
  const { isAuthenticated } = getKindeServerSession()
  return await isAuthenticated()
}

export function authenticateBearerToken(token: string) {
  for (const key of ENV.APP_API_AUTH_TOKENS) {
    if (token === key) return { token: true } as const
  }
  throw new AppError('unauthorized', 'Unauthorized')
}

export async function authenticateApiRequest(headers: Headers) {
  const value = headers.get('Authorization')
  const token = value ? authenticateBearerToken(value) : null
  if (token) return token
  return { user: await getUserSession() }
}
