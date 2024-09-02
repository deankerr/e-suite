'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

import { MessageFeed } from '@/app/chat/[thread_id]/MessageFeed'
import { htmlTextAtom } from '@/components/artifacts/atoms'
import { HTMLRenderer } from '@/components/artifacts/HTMLRenderer'
import { Composer } from '@/components/composer/Composer'
import { ChatToolbar } from '@/components/threads/ChatToolbar'
import { Thread } from '@/components/threads/Thread'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useThread, useThreadActions } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string } }) {
  const thread = useThread(params.thread_id)
  const actions = useThreadActions(thread?._id)

  const [htmlText, setHtmlText] = useAtom(htmlTextAtom)

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
          <SectionHeader className="pl-3 pr-1">
            Artifact
            <div className="grow" />
            <IconButton aria-label="Close" variant="ghost" onClick={() => setHtmlText('')}>
              <Icons.X size={18} />
            </IconButton>
          </SectionHeader>
          <div className="grow">
            <HTMLRenderer htmlText={htmlText} />
          </div>
        </Section>
      )}
    </>
  )
}
