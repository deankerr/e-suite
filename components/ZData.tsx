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
  const updateGenerationsList = useAppStore((state) => state.updateGenerationsList)

  if (generationsListResult !== undefined) {
    generationsList.current = generationsListResult
  }

  useEffect(() => {
    if (generationsList.current !== undefined) {
      console.log('ZData Generations')
      updateGenerationsList(generationsList.current)
    }
  }, [generationsListResult, updateGenerationsList])

  const threadsListResult = useQuery(api.threads.threads.list, {})
  const threadsList = useRef(threadsListResult)
  const updateThreadsList = useAppStore((state) => state.updateThreadsList)

  if (threadsListResult !== undefined) {
    threadsList.current = threadsListResult
  }

  useEffect(() => {
    if (threadsList.current !== undefined) {
      console.log('ZData Threads')
      updateThreadsList(threadsList.current)
    }
  }, [threadsListResult, updateThreadsList])
  return (
    <div {...props} className={cn('hidden', className)}>
      ZData
    </div>
  )
}
