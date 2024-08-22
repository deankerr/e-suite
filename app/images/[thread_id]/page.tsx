'use client'

import { useQueryState } from 'nuqs'

import { ImagesFeed } from '@/app/images/[thread_id]/ImagesFeed'
import { ImagesList } from '@/app/images/[thread_id]/ImagesList'
import { Composer } from '@/components/composer/Composer'
import { SearchField } from '@/components/form/SearchField'
import { useThread, useThreadActions, useThreadImagesSearch } from '@/lib/api'
import { twx } from '@/lib/utils'

export default function Page({ params }: { params: { thread_id: string } }) {
  const thread = useThread(params.thread_id)
  const actions = useThreadActions(thread?._id)

  const [searchValue, setSearchValue] = useQueryState('search')
  const searchImages = useThreadImagesSearch(params.thread_id, searchValue ?? undefined)

  return (
    <>
      <ImagesToolbarWrapper>
        <SearchField value={searchValue ?? ''} onValueChange={setSearchValue} />
      </ImagesToolbarWrapper>
      <div className="h-96 grow overflow-hidden">
        {searchValue ? (
          <ImagesList images={searchImages ?? []} />
        ) : (
          <ImagesFeed thread_id={params.thread_id} />
        )}
      </div>
      {thread && thread.userIsViewer && (
        <Composer
          initialResourceKey={thread.latestRunConfig?.resourceKey}
          loading={actions.state !== 'ready'}
          onSend={actions.send}
        />
      )}
    </>
  )
}

const ImagesToolbarWrapper = twx.div`flex-start h-10 border-b border-gray-5 w-full gap-1 px-1 text-sm`
