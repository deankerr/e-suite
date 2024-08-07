'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toolbar from '@radix-ui/react-toolbar'
import { AlertDialog, Dialog, TextField } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

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
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { appConfig } from '@/config/config'
import { defaultRunConfigChat } from '@/convex/shared/defaults'
import { isSameAuthor } from '@/convex/shared/helpers'
import { useDeleteThread, useThreadActions, useThreads, useUpdateThread } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { RunConfig } from '@/convex/types'
import type { UsePaginatedQueryResult } from 'convex/react'

export const ThreadPanel = () => {
  const shell = useShellActions()
  const path = useSuitePath()

  const { thread } = useThreads(path.slug)
  const threadTitle = thread?.title ?? 'Thread'
  const latestRunConfig = thread?.latestRunConfig ?? defaultRunConfigChat

  const [queryFilters, setQueryFilters] = useAtom(messageQueryAtom)
  const { messages, loadMore, status, isLoading } = useMessagesQuery()
  const router = useRouter()

  const actions = useThreadActions(thread?._id)

  const handleSend = async (
    method: 'run' | 'add',
    { text, ...runConfig }: RunConfig & { text: string },
  ) => {
    if (!thread) return false

    // * add / run chat
    if (method === 'add' || (runConfig.type === 'chat' && text)) {
      const result = await actions.append({
        message: {
          role: 'user',
          text,
        },
        runConfig: method !== 'add' ? runConfig : undefined,
      })

      if (result && result.threadId !== thread._id) {
        router.push(`${appConfig.threadUrl}/${result.slug}`)
      }
      return !!result
    }

    // * run image
    const result = await actions.run({
      runConfig,
    })
    if (result && result.threadId !== thread._id) {
      router.push(`${appConfig.threadUrl}/${result.slug}`)
    }
    return !!result
  }

  const [showJson, setShowJson] = useState(false)

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

          <EditThreadTitleDialog threadId={thread?._id ?? ''} currentTitle={threadTitle}>
            <IconButton variant="ghost" color="gray" aria-label="Edit">
              <Icons.Pencil size={20} />
            </IconButton>
          </EditThreadTitleDialog>

          <DeleteThreadDialog threadId={thread?._id ?? ''}>
            <IconButton variant="ghost" color="gray" aria-label="Delete">
              <Icons.Trash size={20} />
            </IconButton>
          </DeleteThreadDialog>
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

        <div className="flex-start gap-2">
          <ThreadOwner>
            <Toolbar.Button asChild>
              <TextEditorDialog slug={thread?.slug ?? ''}>
                <Button variant="soft" color="gray" size="1">
                  Instructions
                </Button>
              </TextEditorDialog>
            </Toolbar.Button>
          </ThreadOwner>

          <AdminOnlyUi>
            <Toolbar.Button asChild>
              <IconButton
                aria-label="Show JSON"
                variant="ghost"
                color={showJson ? undefined : 'gray'}
                onClick={() => setShowJson(!showJson)}
              >
                <Icons.FileJs size={20} />
              </IconButton>
            </Toolbar.Button>
          </AdminOnlyUi>
        </div>
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

      {showJson && (
        <Pre className="absolute inset-x-0 inset-y-20 z-20 max-w-[60vw] text-wrap">
          {JSON.stringify(thread, null, 2)}
        </Pre>
      )}

      <Panel.Footer>
        {thread && (
          <ThreadOwner>
            <Composer
              initialResourceKey={latestRunConfig.resourceKey}
              loading={actions.state !== 'ready'}
              onSend={handleSend}
            />
          </ThreadOwner>
        )}
      </Panel.Footer>
    </Panel>
  )
}

const EditThreadTitleDialog = ({
  threadId,
  currentTitle,
  children,
}: {
  threadId: string
  currentTitle: string
  children: React.ReactNode
}) => {
  const sendUpdateThread = useUpdateThread()
  const [title, setTitle] = useState(currentTitle)
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit title</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your thread.
        </Dialog.Description>

        <div className="flex flex-col gap-3">
          <label>
            Title
            <TextField.Root
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your new title"
            />
          </label>
        </div>

        <div className="flex-end mt-4 gap-2">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={() => sendUpdateThread({ threadId, fields: { title } })}>Save</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const DeleteThreadDialog = ({
  threadId,
  children,
}: {
  threadId: string
  children: React.ReactNode
}) => {
  const sendDeleteThread = useDeleteThread()

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Thread</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This thread will be gone forever.
        </AlertDialog.Description>

        <div className="flex-end mt-4 gap-2">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => sendDeleteThread({ threadId })}>
              Delete
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
