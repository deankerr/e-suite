import { AppShell } from '@/components/app-shell'
import { getSession } from '@/lib/server'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'

export default async function AppLandingPage() {
  // const session = await getSession()
  // if (!session) return <p>Not logged in ehh?</p>

  return (
    <div>
      Hello! App landing page
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
      <LogoutLink>Log out</LogoutLink>
    </div>
  )
}
