'use client'

import { useThreads } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

export const ThreadOwner = ({ children }: { children?: React.ReactNode }) => {
  const path = useSuitePath()
  const { thread } = useThreads(path.slug)
  const isOwner = thread?.user?.isViewer ?? false

  return isOwner ? children : null
}
