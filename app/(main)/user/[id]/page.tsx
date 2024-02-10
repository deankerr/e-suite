'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'

export default function UserIdPage({ params }: { params: { id: Id<'users'> } }) {
  const user = useQuery(api.users.getPrivateProfile, { id: params.id })

  return (
    <div className="">
      <p>UserIdPage</p>
      <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}

//dgYBFIQlTQ31RgarblemjKxv8DjaV6l67yWzH
