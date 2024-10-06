'use client'

import { useEffect, useState } from 'react'

import { useThreadTextSearchResults } from '@/app/lib/api/threads'
import { cn } from '@/lib/utils'
import { FishFoodIcon } from '../icons/FishFoodIcon'
import { Message } from '../message/Message'
import { Orbit } from '../ui/Ldrs'
import { VScrollArea } from '../ui/VScrollArea'

export const MessageSearchResults = ({ threadId }: { threadId: string }) => {
  const { results, isLoading, isActive } = useThreadTextSearchResults(threadId)

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
            'divide-y divide-gray-4',
            fadeOut && 'opacity-50 transition-opacity duration-300 ease-in-out',
          )}
        >
          {results.map((message) => (
            <div key={message._id} className="py-1">
              <Message message={message} />
            </div>
          ))}
        </div>

        {results.length === 0 ? (
          isActive ? (
            <div className="flex-col-center h-full w-full">
              <FishFoodIcon className="size-36 text-gray-10" />
              <div className="text-base font-medium text-gray-11">No results.</div>
            </div>
          ) : (
            <div className="py-1">Enter a query.</div>
          )
        ) : null}
      </VScrollArea>

      {isLoading && (
        <div className="absolute right-4 top-4">
          <Orbit />
        </div>
      )}
    </div>
  )
}
