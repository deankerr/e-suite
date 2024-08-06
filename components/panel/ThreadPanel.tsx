'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Composer } from '@/components/composer/Composer'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { Message } from '@/components/message/Message'
import { Panel } from '@/components/panel/Panel'
import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { useShellActions } from '@/components/shell/hooks'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button, IconButton } from '@/components/ui/Button'
import { appConfig } from '@/config/config'
import { isSameAuthor } from '@/convex/shared/helpers'
import { useThreads } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

export const ThreadPanel = () => {
  const shell = useShellActions()
  const path = useSuitePath()

  const { thread } = useThreads(path.slug)
  const threadTitle = thread?.title ?? 'Thread'
  const { messages } = useMessagesQuery()

  return (
    <Panel>
      <Panel.Header>
        <SidebarButton />
        <Panel.Title>{threadTitle}</Panel.Title>
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
      </Panel.Header>

      <Panel.Toolbar>
        <Toolbar.ToggleGroup type="single" aria-label="View">
          <Toolbar.ToggleItem
            value="images"
            className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-accentA-3 hover:text-accentA-12 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
          >
            <Icons.Images size={20} />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-[10px] h-3/4 w-[1px] bg-grayA-3" />

        <Toolbar.ToggleGroup type="single" aria-label="Role">
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

        <Toolbar.Button asChild>
          <TextEditorDialog slug={thread?.slug ?? ''}>
            <Button variant="soft" color="gray" size="1">
              Instructions
            </Button>
          </TextEditorDialog>
        </Toolbar.Button>
      </Panel.Toolbar>

      <Panel.Content>
        <div className="flex h-full flex-col-reverse p-1 text-sm">
          {messages.map((message, i) => (
            <Message
              key={message._id}
              message={message}
              priority={i === 0}
              deepLinkUrl={`${appConfig.threadUrl}/${thread?.slug}/${message.series}`}
              isSequential={isSameAuthor(message, messages.at(i + 1))}
            />
          ))}
        </div>
      </Panel.Content>

      <Panel.Footer>
        {thread && (
          <Composer
            runConfig={thread.inference}
            model={thread.model}
            onModelChange={() => shell.open({ threadId: thread._id })}
            textareaMinRows={1}
            threadId={thread._id}
            className="w-full"
          />
        )}
      </Panel.Footer>
    </Panel>
  )
}
