import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function logAuthData() {
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
