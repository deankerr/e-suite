import { auth } from '@/auth'

export default async function SuiteIndexPage() {
  // SuitePage
  const session = await auth()

  const sesh = session ? JSON.stringify(session, null, 2) : 'not logged in'

  if (session) {
    //
  }

  return (
    <div>
      <p>SuitePage</p>
      <pre className="overflow-x-auto">{sesh}</pre>
    </div>
  )
}
