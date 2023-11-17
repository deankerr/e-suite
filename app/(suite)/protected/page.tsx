import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export default async function ProtectedPage() {
  // ProtectedPage
  const { isAuthenticated } = getKindeServerSession()

  return (
    <div>
      <p>ProtectedPage</p>
      {(await isAuthenticated()) ? 'You are authenticated.' : 'Scram, bozo!'}
    </div>
  )
}
