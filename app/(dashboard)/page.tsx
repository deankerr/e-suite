'use client'

import { useAgent3 } from '@/components/queries-reloaded'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'

export default function AppLandingPage() {
  const ag3 = useAgent3({ id: 'seed1-99jyeME' })
  // const ag3 = useAgent3({ id: 131 })
  return (
    <div>
      ag3: {ag3.data?.name}
      err: {ag3.error?.message}
      <br />
      Hello! App landing page
      <br />
      <LoginLink>Sign in</LoginLink>
      <br />
      <RegisterLink>Sign up</RegisterLink>
      <br />
      <LogoutLink>Log out</LogoutLink>
    </div>
  )
}
