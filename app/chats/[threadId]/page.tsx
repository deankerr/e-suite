'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

import { htmlTextAtom } from '@/components/artifacts/atoms'
import { HTMLRenderer } from '@/components/artifacts/HTMLRenderer'
import { Chat } from '@/components/chat/Chat'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { MessageSearchResults } from '@/components/chat/MessageSearchResults'
import { IconButton } from '@/components/ui/Button'
import { Panel, PanelHeader } from '@/components/ui/Panel'

export default function Page({ params }: { params: { threadId: string } }) {
  const [htmlText, setHtmlText] = useAtom(htmlTextAtom)

  return (
    <>
      <Chat threadId={params.threadId}>
        <div className="grid grow grid-flow-col overflow-hidden outline outline-2 -outline-offset-4 outline-pink-8">
          {/* <div className=''>
            <MessageFeed threadId={params.threadId} />
          </div> */}
          <div>
            <MessageSearchResults threadId={params.threadId} />
          </div>
        </div>
      </Chat>

      {htmlText && (
        <Panel>
          <PanelHeader className="pl-3 pr-1">
            Artifact
            <div className="grow" />
            <IconButton aria-label="Close" variant="ghost" onClick={() => setHtmlText('')}>
              <Icons.X size={18} />
            </IconButton>
          </PanelHeader>
          <div className="grow">
            <HTMLRenderer htmlText={htmlText} />
          </div>
        </Panel>
      )}
    </>
  )
}
