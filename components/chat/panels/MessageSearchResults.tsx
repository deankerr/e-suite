'use client'

import { useEffect, useState } from 'react'

import { useThreadTextSearchResults } from '@/app/lib/api/threads'
import { cn } from '@/app/lib/utils'
import { FishFoodIcon } from '@/components/icons/FishFoodIcon'
import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'

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
          <ScrollArea className="bg-gray-1">
            <div
              className={cn(
                '',
                fadeOut && 'opacity-50 transition-opacity duration-300 ease-in-out',
              )}
            >
              {results.map((message) => (
                <div key={message._id} className="mx-auto max-w-[85ch] py-3">
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
          </ScrollArea>
        </PanelBody>
      )}

      {isLoading && (
        <div className="absolute right-4 top-4">
          <Loader type="orbit" />
        </div>
      )}
    </>
  )
}
