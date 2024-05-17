import { ThreadPage } from '@/components/pages/ThreadPage'

import type { ThreadKeys } from '@/lib/types'

export default function Page({ params }: { params: { keys: ThreadKeys } }) {
  console.log(params)
  return <ThreadPage keys={params.keys} />
}
