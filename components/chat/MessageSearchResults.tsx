'use client'

import { useEffect, useState } from 'react'

import { useThreadTextSearchResults } from '@/app/lib/api/threads'
import { cn } from '@/lib/utils'
import { FishFoodIcon } from '../icons/FishFoodIcon'
import { Message } from '../message/Message'
import { Orbit } from '../ui/Ldrs'
import { PanelBody } from '../ui/Panel'
import { VScrollArea } from '../ui/VScrollArea'

export const MessageSearchResults = ({ threadId }: { threadId: string }) => {
  const { results, isLoading, isSkipped } = useThreadTextSearchResults(threadId)

  const [fadeOut, setFadeOut] = useState(false)
  useEffect(() => {
    if (isLoading) setFadeOut(true)
    else setFadeOut(false)
  }, [isLoading])

  return (
    <>
      {!isSkipped && (
        <PanelBody>
          <VScrollArea className="bg-gray-1">
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

            {results.length === 0 && !isLoading ? (
              <div className="flex-col-center h-full w-full">
                <FishFoodIcon className="size-36 text-gray-10" />
                <div className="text-base font-medium text-gray-11">No results.</div>
              </div>
            ) : null}
          </VScrollArea>
        </PanelBody>
      )}

      {isLoading && (
        <div className="absolute right-4 top-4">
          <Orbit />
        </div>
      )}
    </>
  )
}
