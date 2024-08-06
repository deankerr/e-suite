'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toolbar from '@radix-ui/react-toolbar'
import { useAtom } from 'jotai'

import { Composer } from '@/components/composer/Composer'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { Message } from '@/components/message/Message'
import { Panel } from '@/components/panel/Panel'
import { ThreadOwner } from '@/components/panel/ThreadOwner'
import { messageQueryAtom } from '@/components/providers/atoms'
import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { useShellActions } from '@/components/shell/hooks'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button, IconButton } from '@/components/ui/Button'
import { LoadMoreButton } from '@/components/ui/LoadMoreButton'
import { appConfig } from '@/config/config'
import { isSameAuthor } from '@/convex/shared/helpers'
import { useThreads } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { UsePaginatedQueryResult } from 'convex/react'

export const ThreadPanel = () => {
  const shell = useShellActions()
  const path = useSuitePath()

  const { thread } = useThreads(path.slug)
  const threadTitle = thread?.title ?? 'Thread'
  const { messages, loadMore, status, isLoading } = useMessagesQuery()

  const [queryFilters, setQueryFilters] = useAtom(messageQueryAtom)

  return (
    <Panel>
      <Panel.Header>
        <SidebarButton />
        <Panel.Title>{threadTitle}</Panel.Title>
        <ThreadOwner>
          <IconButton
            variant="ghost"
            color="gray"
            aria-label="More options"
            onClick={() => shell.open({ threadId: thread?._id })}
          >
            <DotsThreeFillX width={20} height={20} />
          </IconButton>
          <IconButton variant="ghost" color="gray" aria-label="Favorite">
            <Icons.Star size={20} />
          </IconButton>
        </ThreadOwner>
      </Panel.Header>

      <Panel.Toolbar>
        <Toolbar.ToggleGroup
          type="single"
          aria-label="View"
          value={queryFilters.byMediaType === 'images' ? 'images' : ''}
          onValueChange={(value) => {
            setQueryFilters({
              ...queryFilters,
              byMediaType: value === 'images' ? 'images' : undefined,
            })
          }}
        >
          <Toolbar.ToggleItem
            value="images"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-accentA-3 hover:text-accentA-12 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.Images size={20} />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-[10px] h-3/4 w-[1px] bg-grayA-3" />

        <Toolbar.ToggleGroup
          type="single"
          aria-label="Role"
          value={queryFilters.role ?? ''}
          onValueChange={(value) => {
            setQueryFilters({
              ...queryFilters,
              role: ['assistant', 'user'].includes(value)
                ? (value as 'assistant' | 'user')
                : undefined,
            })
          }}
        >
          <Toolbar.ToggleItem
            value="user"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-accentA-3 hover:text-accentA-12 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.User size={20} />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            value="assistant"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-accentA-3 hover:text-accentA-12 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.Robot size={20} />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-[10px] h-3/4 w-[1px] bg-grayA-3" />

        <ThreadOwner>
          <Toolbar.Button asChild>
            <TextEditorDialog slug={thread?.slug ?? ''}>
              <Button variant="soft" color="gray" size="1">
                Instructions
              </Button>
            </TextEditorDialog>
          </Toolbar.Button>
        </ThreadOwner>
      </Panel.Toolbar>

      <Panel.Content>
        <div className="flex-center p-1">
          <LoadMoreButton
            color="gray"
            variant="surface"
            query={{ loadMore, status, isLoading, results: [] } as UsePaginatedQueryResult<any>}
          />
        </div>
        <div className="flex flex-col-reverse px-1 text-sm">
          {messages.map((message, i) => (
            <Message
              key={message._id}
              message={message}
              deepLinkUrl={`${appConfig.threadUrl}/${thread?.slug}/${message.series}`}
              isSequential={isSameAuthor(message, messages.at(i + 1))}
            />
          ))}
        </div>
      </Panel.Content>

      <Panel.Footer>
        {thread && (
          <ThreadOwner>
            <Composer
              runConfig={thread.inference}
              model={thread.model}
              onModelChange={() => shell.open({ threadId: thread._id })}
              textareaMinRows={1}
              threadId={thread._id}
              className="w-full"
            />
          </ThreadOwner>
        )}
      </Panel.Footer>
    </Panel>
  )
}
