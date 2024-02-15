'use client'

import { BShell } from '@/app/components/ui/BShell'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function UserPage() {
  const user = useQuery(api.users.getPrivateProfile, {})

  return (
    <div className="">
      <p>UserPage</p>
      <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
      <BShell.Root>
        <BShell.Titlebar>Hi</BShell.Titlebar>
        <BShell.Content>Coo</BShell.Content>
      </BShell.Root>
    </div>
  )
}
