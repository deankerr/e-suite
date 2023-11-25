import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const userRoles = {
  admin: 'admin',
  user: 'user',
  none: 'none',
} as const

export type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>
export async function getSession() {
  const { getUser, getPermissions } = getKindeServerSession()

  const user = await getUser()
  const permissions = await getPermissions()

  if (!user || !permissions) return null

  const keys = permissions.permissions
  const role = keys.includes('role:admin')
    ? userRoles.admin
    : keys.includes('role:user')
    ? userRoles.user
    : userRoles.none

  return {
    id: user.id,
    email: user.email,
    firstName: user.given_name,
    lastName: user.family_name,
    image: user.picture,
    role,
  }
}

export async function logKindeAuthData() {
  const {
    getAccessToken,
    getBooleanFlag,
    getFlag,
    getIntegerFlag,
    getOrganization,
    getPermission,
    getPermissions,
    getStringFlag,
    getUser,
    getUserOrganizations,
    isAuthenticated,
  } = getKindeServerSession()

  console.log('')
  console.group('### kindeAuth ###')
  console.log('getAccessToken', await getAccessToken())
  // console.log('getBooleanFlag', await getBooleanFlag('bflag', false))
  // console.log('getFlag x s', await getFlag('flag', 'x', 's'))
  // console.log('getIntegerFlag iflag 99', await getIntegerFlag('iflag', 99))
  console.log('getOrganization', await getOrganization())
  console.log('getPermission administration', await getPermission('administration'))
  console.log('getPermission premium_engines', await getPermission('premium_engines'))
  console.log('getPermissions', await getPermissions())
  console.log('getAccessToken', await getAccessToken())
  // console.log(await getStringFlag('sflag', 'test'))
  console.log('getUser', await getUser())
  console.log('getUserOrganizations', await getUserOrganizations())
  console.log('isAuthenticated', await isAuthenticated())
  console.groupEnd()
  console.log('')
}
