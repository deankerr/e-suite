import { logKindeAuthData } from '@/lib/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export default async function ProtectedPage() {
  // ProtectedPage
  logKindeAuthData()
  const { isAuthenticated } = getKindeServerSession()

  return (
    <div>
      <p>ProtectedPage</p>
      {(await isAuthenticated()) ? 'You are authenticated.' : 'Scram, bozo!'}
    </div>
  )
}
