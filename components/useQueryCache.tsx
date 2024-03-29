import { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { usePathname } from 'next/navigation'

import { api } from '@/convex/_generated/api'

export const useQueryCache = () => {
  const [hasUsedChatRoute, setHasUsedChatRoute] = useState(false)
  const [hasUsedGenerateRoute, setHasUsedGenerateRoute] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/chat') && !hasUsedChatRoute) {
      setHasUsedChatRoute(true)
    }

    if (pathname.startsWith('/generate') && !hasUsedGenerateRoute) {
      setHasUsedGenerateRoute(true)
    }
  }, [hasUsedChatRoute, hasUsedGenerateRoute, pathname])

  useQuery(api.voices.list, hasUsedChatRoute ? {} : 'skip')

  useQuery(api.generations.imageModels.list, hasUsedGenerateRoute ? {} : 'skip')
}
