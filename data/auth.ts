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

export async function authenticateApiSession(headers: Headers) {
  const authKey = headers.get('Authorization')
  if (authKey) {
    for (const key of ENV.APP_API_AUTH_TOKENS) {
      if (authKey === key) return { authId: authKey }
    }
  }

  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (user) {
    return { authId: user.id }
  }

  throw new AppError('unauthorized', 'Unauthorized')
}

async function getServerSession() {
  const { getUser, getPermissions } = getKindeServerSession()

  const kindeUser = await getUser()
  const kindePermissions = await getPermissions()

  if (!kindeUser || !kindePermissions) return null

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

function validateApiKey(headers: Headers) {
  const auth = headers.get('Authorization')
  if (!auth) return null
  for (const key of ENV.APP_API_AUTH_TOKENS) {
    if (auth === key) return auth
  }
  return null
}

type ApiKeySession = Readonly<{
  isAuthenticated: true
  session: {
    id: string
  }
}>

type ApiAuthSession = Readonly<{
  isAuthenticated: true
  session: {
    id: string
    email: string
    firstName: string
    lastName: string
    image: string
    permissions: string[]
  }
}>

type ApiUnauthorized = Readonly<{
  isAuthenticated: false
}>

export type AuthorizedApiSession = ApiKeySession | ApiAuthSession

type ApiAuthorization = ApiKeySession | ApiAuthSession | ApiUnauthorized
export async function authenticateApiRequest(headers: Headers): Promise<ApiAuthorization> {
  const apiKey = validateApiKey(headers)
  if (apiKey) {
    return {
      isAuthenticated: true,
      session: {
        id: apiKey,
      },
    }
  }

  const auth = await getServerSession()
  if (auth) {
    return {
      isAuthenticated: true,
      session: auth,
    }
  }

  return {
    isAuthenticated: false,
  }
}
