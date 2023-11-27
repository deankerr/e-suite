'use client'

import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'

export default function AppLandingPage() {
  return (
    <div>
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
