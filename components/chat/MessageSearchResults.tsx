'use client'

import { useAtomValue } from 'jotai'

import { useThreadTextSearch } from '@/app/lib/api/threads'
import { Message } from '../message/Message'
import { VScrollArea } from '../ui/VScrollArea'
import { threadSearchTextAtom } from './atoms'

export const MessageSearchResults = ({ threadId }: { threadId: string }) => {
  const searchText = useAtomValue(threadSearchTextAtom)

  const queryKey = searchText.trim().length >= 3 ? { threadId, text: searchText } : 'skip'
  const results = useThreadTextSearch(queryKey)

  return (
    <div className="h-full overflow-hidden">
      <VScrollArea>
        <div className="divide-y divide-gray-7">
          {results?.map((message) => (
            <div key={message._id} className="py-1">
              <Message message={message} />
            </div>
          ))}
        </div>

        {!results ? <div>Waiting...</div> : results.length === 0 ? <div>No results</div> : null}
        {results === null ? <div>Null results</div> : null}
      </VScrollArea>
    </div>
  )
}
