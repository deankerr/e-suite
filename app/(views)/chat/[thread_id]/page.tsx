'use client'

import { MessageFeed } from '@/app/(views)/chat/[thread_id]/MessageFeed'
import { Composer } from '@/components/composer/Composer'
import { useThreadActions, useThreads } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string } }) {
  const { thread } = useThreads(params.thread_id)
  const actions = useThreadActions(thread?._id)

  return (
    <>
      <div className="grow">
        <MessageFeed slug={params.thread_id} />
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
