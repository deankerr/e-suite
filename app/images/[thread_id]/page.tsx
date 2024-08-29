'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { ScrollArea } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

import { useImagesQueryContext } from '@/app/images/ImagesQueryProvider'
import { GenerationForm } from '@/components/generation/GenerationForm'
import { IImageCard } from '@/components/images/IImageCard'
import { IconButton } from '@/components/ui/Button'
import { InfiniteScroll } from '@/components/ui/InfiniteScroll'
import { Orbit } from '@/components/ui/Ldrs'
import { SectionHeader } from '@/components/ui/Section'
import { useThread, useThreadActions } from '@/lib/api'
import { cn, twx } from '@/lib/utils'

const ResultsGrid = twx.div`grid auto-rows-max grid-cols-2 md:grid-cols-3 gap-2 p-2 xl:grid-cols-4`

export default function Page({ params }: { params: { thread_id: string } }) {
  const pathname = usePathname()
  const thread = useThread(params.thread_id)
  const { imagesFeed } = useImagesQueryContext()

  const actions = useThreadActions(thread?._id)

  const [showGenerate, setShowGenerate] = useState(false)

  return (
    <>
      <div className="flex h-96 grow items-stretch divide-x overflow-hidden">
        <div className={cn('flex grow flex-col overflow-hidden', showGenerate && 'hidden sm:flex')}>
          <ScrollArea scrollbars="vertical">
            <ResultsGrid className="mb-16 [&>div]:aspect-square">
              {imagesFeed.results.map((image) => (
                <IImageCard
                  key={image._id}
                  image={image}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33.33vw, 50vw"
                  href={`${pathname}/${image.id}`}
                  style={{ aspectRatio: 1 }}
                  className="[&>img]:object-cover"
                />
              ))}

              <InfiniteScroll
                isLoading={imagesFeed.isLoading}
                hasMore={imagesFeed.status !== 'Exhausted'}
                next={() => {
                  imagesFeed.loadMore(30)
                  console.log('load more')
                }}
              >
                <div className="h-full w-full" />
              </InfiniteScroll>
            </ResultsGrid>

            <div
              className={cn(
                'flex-col-center absolute inset-x-0 bottom-0 h-16',
                imagesFeed.status === 'Exhausted' && 'hidden',
              )}
            >
              <Orbit />
            </div>
          </ScrollArea>
        </div>

        {showGenerate ? (
          <aside className="flex w-full shrink-0 flex-col sm:w-80">
            <SectionHeader className="px-2">Generate</SectionHeader>
            <ScrollArea scrollbars="vertical">
              <GenerationForm onRun={actions.run} loading={actions.state !== 'ready'} />
            </ScrollArea>
          </aside>
        ) : null}

        <IconButton
          onClick={() => setShowGenerate(!showGenerate)}
          aria-label={showGenerate ? 'Close' : 'Generate'}
          className="absolute right-1 top-1"
        >
          {showGenerate ? <Icons.X /> : <Icons.Plus />}
        </IconButton>
      </div>
    </>
  )
}
