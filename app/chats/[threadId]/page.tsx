'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

import { htmlTextAtom } from '@/components/artifacts/atoms'
import { HTMLRenderer } from '@/components/artifacts/HTMLRenderer'
import { Chat } from '@/components/chat/Chat'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'

export default function Page({ params }: { params: { threadId: string } }) {
  const [htmlText, setHtmlText] = useAtom(htmlTextAtom)

  return (
    <>
      <Chat threadId={params.threadId}>
        <div className="grow">
          <MessageFeed threadId={params.threadId} />
        </div>
      </Chat>

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
