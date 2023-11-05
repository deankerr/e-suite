import { auth } from '@/auth'
import { createChatTab } from '@/components/chat/actions'
import { authServerPublic, getUserSession } from '@/lib/db'

export default async function SuiteIndexPage() {
  const { session, user } = await authServerPublic()

  if (!session || !user)
    return (
      <div>
        <p>Consider logging in to improve your e/suite experience.</p>
        <PrePrint>{session}</PrePrint>
      </div>
    )

  if (user.chatTabs.length === 0) {
    console.log('creating initial tab')
    const newTab = await createChatTab(user.id)
  }

  return (
    <div>
      <h1>
        Welcome, <span className="font-mono">{user.name}</span>
      </h1>
      <p>
        You are my favourite <span className="font-mono">{user.role}.</span>
      </p>
      <PrePrint>{session}</PrePrint>
    </div>
  )
}

function PrePrint({ children }: { children: any }) {
  return <pre className="overflow-x-auto text-sm">{JSON.stringify(children, null, 2)}</pre>
}
