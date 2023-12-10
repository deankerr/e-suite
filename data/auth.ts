import 'server-only'
import { ENV } from '@/lib/env'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function getIsAuthenticated() {
  const { isAuthenticated } = getKindeServerSession()
  return await isAuthenticated()
}

export async function getServerSession() {
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
    isAdmin: kindePermissions.permissions.includes('admin'),
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
