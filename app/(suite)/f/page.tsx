import { auth } from '@/auth'
import { AppShell } from '@/components/suite/app-shell'

export default async function FPage() {
  const session = await auth()

  if (!session) return <p>Not logged in ehh?</p>

  return <AppShell session={session} />
}
