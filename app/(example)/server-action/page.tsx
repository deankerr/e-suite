import { serverSession } from '@/lib/auth'
import { WhoAmIButton } from './who-am-i-button'

export default async function ServerActionPage() {
  const whoAmI = async () => {
    'use server'
    const session = await serverSession()
    return session?.user?.name || 'Not Logged In'
  }

  return (
    <div>
      <WhoAmIButton whoAmIAction={whoAmI} />
    </div>
  )
}
