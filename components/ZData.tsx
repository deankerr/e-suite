'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { useEffect, useRef } from 'react'
import { useAppStore } from './providers/AppStoreProvider'

type ZDataProps = {} & React.ComponentProps<'div'>

export const ZData = ({ className, ...props }: ZDataProps) => {
  const generationsListResult = useQuery(api.generations.do.list, {})
  const generationsList = useRef(generationsListResult)

  if (generationsListResult !== undefined) {
    generationsList.current = generationsListResult
  }

  const updateGenerationsList = useAppStore((state) => state.updateGenerationsList)

  useEffect(() => {
    if (generationsList.current !== undefined) {
      console.log('ZData Effect')
      updateGenerationsList(generationsList.current)
    }
  }, [generationsListResult, updateGenerationsList])
  return (
    <div {...props} className={cn('hidden', className)}>
      ZData
    </div>
  )
}
