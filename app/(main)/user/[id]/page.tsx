'use client'

import { Id } from '@/convex/_generated/dataModel'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserIdPage({ params }: { params: { id: Id<'users'> } }) {
  return (
    <div className="">
      <p>UserIdPage</p>
    </div>
  )
}
