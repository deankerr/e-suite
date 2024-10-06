'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

import { useThreadTextSearch } from '@/app/lib/api/threads'
import { cn } from '@/lib/utils'
import { Message } from '../message/Message'
import { Orbit } from '../ui/Ldrs'
import { VScrollArea } from '../ui/VScrollArea'
import { threadSearchTextAtom } from './atoms'

export const MessageSearchResults = ({ threadId }: { threadId: string }) => {
  const searchText = useAtomValue(threadSearchTextAtom)
  const { results, isLoading } = useThreadTextSearch({ threadId }, searchText)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setFadeOut(true)
    } else {
      setFadeOut(false)
    }
  }, [isLoading])

  return (
    <div className="h-full overflow-hidden">
      <VScrollArea>
        <div
          className={cn(
            'divide-y divide-gray-7',
            fadeOut && 'opacity-50 transition-opacity duration-300 ease-in-out',
          )}
        >
          {results?.map((message) => (
            <div key={message._id} className="py-1">
              <Message message={message} />
            </div>
          ))}
        </div>
      </VScrollArea>

      {isLoading && (
        <div className="absolute right-2 top-2">
          <Orbit />
        </div>
      )}
    </div>
  )
}
