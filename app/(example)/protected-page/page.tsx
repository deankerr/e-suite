import { serverSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await serverSession()

  if (!session || !session.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div>
      <p>Welcome to ProtectedPage {session?.user?.name}</p>
    </div>
  )
}
