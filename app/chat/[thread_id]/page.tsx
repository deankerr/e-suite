'use client'

import { MessageFeed } from '@/app/chat/[thread_id]/MessageFeed'
import { Composer } from '@/components/composer/Composer'
import { useThread, useThreadActions } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string } }) {
  const thread = useThread(params.thread_id)
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
