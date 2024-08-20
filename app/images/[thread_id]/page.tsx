'use client'

import { ImagesFeed } from '@/app/images/[thread_id]/ImagesFeed'
import { Composer } from '@/components/composer/Composer'
import { useThreadActions, useThreads } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string } }) {
  const { thread } = useThreads(params.thread_id)
  const actions = useThreadActions(thread?._id)

  return (
    <>
      <div className="h-96 grow overflow-hidden">
        <ImagesFeed thread_id={params.thread_id} />
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
