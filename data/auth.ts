import 'server-only'
import { AppCodeError } from '@/lib/error'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { initializeUserData } from './internal/user'

export type UserSession = Awaited<ReturnType<typeof getUserSession>>

export async function getUserSession() {
  const { getUser, getPermissions } = getKindeServerSession()

  const kindeUser = await getUser()
  const kindePermissions = await getPermissions()

  if (!kindeUser || !kindePermissions)
    throw new AppCodeError('unauthorized', 'You are not logged in.', {
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
