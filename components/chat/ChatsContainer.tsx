'use client'

import { useRef, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

import { useThread, useThreads } from '@/app/lib/api/threads'
import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { Toolbar } from '@/components/chat/Toolbar'
import { Composer } from '@/components/composer/Composer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Panel, PanelHeader, PanelTitle, PanelToolbar } from '@/components/ui/Panel'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { useThreadActions } from '@/lib/api'
import { MDXEditor } from '../mdx-editor/MDXEditor'

import type { MDXEditorMethods } from '@mdxeditor/editor'

const page: string = ''

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)
  const actions = useThreadActions(threadId)

  const [instructions, setInstructions] = useState(sampleInstructions)

  if (!thread)
    return (
      <Panel>
        <PanelHeader>{thread === null ? 'Thread not found' : <SkeletonShimmer />}</PanelHeader>
      </Panel>
    )

  return (
    <Panel {...props}>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href={`/chats/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
        <ChatMenu threadId={thread.slug} />
        <FavouriteButton threadId={thread.slug} />
        <div className="grow" />
      </PanelHeader>

      {!page && (
        <>
          <Toolbar threadId={threadId} />
          {children}

          {thread.user.isViewer && (
            <Composer
              onAppend={actions.append}
              loading={actions.state !== 'ready'}
              initialResourceKey={thread.latestRunConfig?.resourceKey}
            />
          )}
        </>
      )}

      {page === 'split' && (
        <>
          <div className="grow">
            <div className="grid h-full grid-cols-[1fr_18rem] divide-x">
              {/* bubble */}
              <div className="p-4">
                <EditBubble instructions={instructions} setInstructions={setInstructions} />
              </div>

              {/* sidebar */}
              <div className="p-2">
                <div>
                  <div>Prompts</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Panel>
  )
}

const EditBubble = ({
  instructions,
  setInstructions,
}: {
  instructions: string
  setInstructions: (instructions: string) => void
}) => {
  const ref = useRef<MDXEditorMethods>(null)

  return (
    <div className="rounded-lg border">
      <div className="absolute -top-3 left-3 bg-gray-1 px-1 text-sm font-medium">Instructions</div>
      <MDXEditor
        ref={ref}
        markdown={instructions}
        onChange={setInstructions}
        className="markdown-body"
      />
    </div>
  )
}

const sampleInstructions = `
You are a helpful AI assistant. Your goal is to provide accurate, informative, and helpful responses to user queries. Be polite, respectful, and concise. If you're unsure about something, say so. Don't make up information. Respect ethical boundaries and avoid harmful content. Clarify ambiguous questions when needed. Tailor your language to the user's level of understanding.
`

export const ChatsContainer = () => {
  const threads = useThreads()

  return (
    <Panel>
      <PanelHeader>Chats</PanelHeader>

      <div className="grid grow grid-flow-col divide-x">
        {threads
          ?.slice(0, 2)
          .map((thread) => <ChatInstance key={thread.slug} threadId={thread.slug} />)}
      </div>
    </Panel>
  )
}

const ChatInstance = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const actions = useThreadActions(threadId)

  if (!thread) return null

  return (
    <div className="flex h-full flex-col">
      <PanelToolbar>Thread: {thread.title}</PanelToolbar>
      <div className="grow"></div>

      <Composer
        onAppend={actions.append}
        loading={actions.state !== 'ready'}
        initialResourceKey={thread.latestRunConfig?.resourceKey}
      />
    </div>
  )
}
