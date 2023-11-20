import { AppShell } from '@/components/app-shell'
import { getSession } from '@/lib/server'

export default async function UiPage() {
  // UiPage
  const session = await getSession()
  if (!session) return <p>Not logged in ehh?</p>

  return <AppShell session={session} />
}
