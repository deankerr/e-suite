import { AppShell } from '@/components/app-shell'
import { getSession } from '@/lib/server'

export default async function AppLandingPage() {
  // const session = await getSession()
  // if (!session) return <p>Not logged in ehh?</p>

  return <div>Hello! App landing page</div>
}
