import { useParams } from 'next/navigation'
import { useMedia } from 'react-use'

import { buildThreadIndex } from '@/lib/utils'

import type { ThreadIndex } from '@/lib/types'

export const useTwMediaQuery = () => {
  return {
    sm: useMedia('(min-width: 520px)', false),
    md: useMedia('(min-width: 768px)', false),
    lg: useMedia('(min-width: 1024px)', false),
    xl: useMedia('(min-width: 1280px)', false),
    '2xl': useMedia('(min-width: 1640px)', false),
  }
}

export const useRouteIndex = (): ThreadIndex => {
  const params = useParams<{ index?: string[] }>()

  return buildThreadIndex(params.index ?? [])
}
