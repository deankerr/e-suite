import { ThreadPage } from '@/components/pages/ThreadPage'
import { buildThreadIndex } from '@/lib/utils'

import type { ThreadIndex } from '@/lib/types'

export default function Page({ params }: { params: { index: ThreadIndex['keys'] } }) {
  const index = buildThreadIndex(params.index)
  return <ThreadPage index={index} />
}
