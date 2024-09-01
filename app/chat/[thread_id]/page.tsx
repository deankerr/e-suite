'use client'

import { useAtomValue } from 'jotai'

import { MessageFeed } from '@/app/chat/[thread_id]/MessageFeed'
import { htmlTextAtom } from '@/components/artifacts/atoms'
import { HTMLRenderer } from '@/components/artifacts/HTMLRenderer'
import { Composer } from '@/components/composer/Composer'
import { ChatToolbar } from '@/components/threads/ChatToolbar'
import { Thread } from '@/components/threads/Thread'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useThread, useThreadActions } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string } }) {
  const thread = useThread(params.thread_id)
  const actions = useThreadActions(thread?._id)

  const htmlText = useAtomValue(htmlTextAtom)

  return (
    <>
      <Thread thread_id={params.thread_id}>
        <ChatToolbar thread_id={params.thread_id} />
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
      </Thread>

      {htmlText && (
        <Section>
          <SectionHeader className="px-3">Artifact</SectionHeader>
          <div className="grow">
            <HTMLRenderer htmlText={htmlText} />
          </div>
        </Section>
      )}
    </>
  )
}
