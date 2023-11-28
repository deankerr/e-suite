import { addTestAgents } from '@/api/server'
import { Button } from '@/components/ui/button'
import { LoginLink, LogoutLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'

export default function AppLandingPage() {
  const addAgents = async () => {
    'use server'
    await addTestAgents()
  }

  return (
    <div>
      Hello! App landing page
      <form action={addAgents}>
        <Button type="submit" variant="outline">
          add test agents
        </Button>
      </form>
      <br />
      <LoginLink>Sign in</LoginLink>
      <br />
      <RegisterLink>Sign up</RegisterLink>
      <br />
      <LogoutLink>Log out</LogoutLink>
    </div>
  )
}
