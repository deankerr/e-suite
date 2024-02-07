import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { ThreadShell } from '../../components/threads/ThreadShell'

export default function ThreadsPage() {
  return (
    <div className="p-8">
      <p>ThreadsPage</p>
      <ThreadShell />
    </div>
  )
}
