'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Dialog } from '@radix-ui/themes'
import { useKeyboardEvent } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'

import { appConfig } from '@/app/b/config'
import {
  Cmdk,
  CmdkEmpty,
  CmdkGroup,
  CmdkInput,
  CmdkItem,
  CmdkList,
} from '@/components/command-shell/components/Cmdk'
import { useCommandShell } from '@/components/command-shell/useCommandShell'
import { AppLogoName } from '@/components/ui/AppLogoName'
import { TextField } from '@/components/ui/TextField'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { commandShellOpenAtom } from '@/lib/atoms'
import { useChatModels, useImageModels } from '@/lib/queries'

const CommandShellMenu = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { threads, updateThread, removeThread } = useCommandShell()

  const [searchValue, setSearchValue] = useState('')

  const [currentPage, setCurrentPage] = useState<keyof typeof page>('main')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const selectedThread = threads?.find((thread) => thread._id === selectedThreadId)

  const chatModels = useChatModels()
  const imageModels = useImageModels()

  const [newThreadTitle, setNewThreadTitle] = useState('')

  const page = {
    main: () => (
      <>
        <CmdkGroup heading="Compose">
          <CmdkItem>
            <Icons.Plus />
            Create new thread
          </CmdkItem>
          <CmdkItem>
            <Icons.Plus />
            Create new generation
          </CmdkItem>
        </CmdkGroup>

        <CmdkGroup heading="Recent">
          {threads
            ? threads.map((thread) => (
                <CmdkItem
                  key={thread._id}
                  value={thread.title ?? 'untitled ' + thread.slug}
                  onSelect={() => {
                    setSelectedThreadId(thread._id)
                    setCurrentPage('threadConfig')
                  }}
                >
                  {thread.model?.type === 'chat' ? (
                    <Icons.Chat className="-mt-0.5" />
                  ) : (
                    <Icons.ImageSquare />
                  )}
                  <div className="truncate">{thread.title ?? 'Untitled'}</div>
                </CmdkItem>
              ))
            : null}
        </CmdkGroup>
      </>
    ),

    threadConfig: () => (
      <>
        <CmdkGroup heading={`Thread: ${selectedThread?.title}`}>
          {!pathname.includes(selectedThread?.slug ?? '') && (
            <CmdkItem
              onSelect={() => {
                router.push(`${appConfig.chatUrl}/${selectedThread?.slug}`)
                // closeDialog()
              }}
            >
              <Icons.CaretDoubleUp weight="light" />
              Open
            </CmdkItem>
          )}

          <CmdkItem onSelect={() => setCurrentPage('editThreadTitle')}>
            <Icons.PencilLine weight="light" />
            Edit title...
          </CmdkItem>
          <CmdkItem
            onSelect={() =>
              setCurrentPage(
                selectedThread?.model?.type === 'chat' ? 'selectChatModel' : 'selectImageModel',
              )
            }
          >
            <Icons.CodesandboxLogo weight="light" />
            Model: {selectedThread?.model?.name ?? 'unknown model'}
          </CmdkItem>
          <CmdkItem>
            <Icons.UserSound weight="light" />
            Voiceover: {selectedThread?.voiceovers?.default ?? 'unknown model'}
          </CmdkItem>
          <CmdkItem
            onSelect={() => setCurrentPage('deleteThread')}
            className="text-red-11 aria-selected:text-red-11"
          >
            <Icons.Trash weight="light" />
            Delete
          </CmdkItem>
          <CmdkItem
            className="text-gray-11"
            onSelect={() => {
              setSelectedThreadId(null)
              setCurrentPage('main')
            }}
          >
            <Icons.CaretLeft weight="light" />
            Back
          </CmdkItem>
        </CmdkGroup>
      </>
    ),

    selectChatModel: () => (
      <>
        <CmdkGroup heading="Chat Models">
          {chatModels?.map((model) => (
            <CmdkItem
              key={model._id}
              value={`${model.name} ${model.endpoint}`}
              onSelect={() => {
                if (!selectedThread) return
                const current =
                  selectedThread.inference.type === 'chat-completion'
                    ? selectedThread.inference
                    : defaultChatInferenceConfig
                const updated = {
                  ...current,
                  resourceKey: model.resourceKey,
                  endpoint: model.endpoint,
                  endpointModelId: model.endpointModelId,
                }
                void updateThread({ threadId: selectedThread._id, fields: { inference: updated } })
                setCurrentPage('threadConfig')
              }}
            >
              {model.name}
            </CmdkItem>
          ))}
          <CmdkItem
            className="text-gray-11"
            onSelect={() => {
              setCurrentPage('threadConfig')
            }}
          >
            <Icons.CaretLeft weight="light" />
            Back
          </CmdkItem>
        </CmdkGroup>
      </>
    ),

    selectImageModel: () => (
      <>
        <CmdkGroup heading="Image Models">
          {imageModels?.map((model) => (
            <CmdkItem
              key={model._id}
              value={`${model.name} ${model.endpoint}`}
              onSelect={() => {
                if (!selectedThread) return
                const current =
                  selectedThread.inference.type === 'text-to-image'
                    ? selectedThread.inference
                    : defaultImageInferenceConfig
                const updated = {
                  ...current,
                  resourceKey: model.resourceKey,
                  endpoint: model.endpoint,
                  endpointModelId: model.endpointModelId,
                }
                void updateThread({ threadId: selectedThread._id, fields: { inference: updated } })
                setCurrentPage('threadConfig')
              }}
            >
              {model.name}
            </CmdkItem>
          ))}
          <CmdkItem
            className="text-gray-11"
            onSelect={() => {
              setCurrentPage('threadConfig')
            }}
          >
            <Icons.CaretLeft weight="light" />
            Back
          </CmdkItem>
        </CmdkGroup>
      </>
    ),

    editThreadTitle: () => {
      if (!selectedThread) return null
      return (
        <>
          <CmdkGroup heading="Edit title">
            <TextField
              size="3"
              className="m-1 mb-2"
              placeholder="Enter new title..."
              value={newThreadTitle}
              onValueChange={setNewThreadTitle}
            />
            <CmdkItem
              className="text-grass-11 aria-selected:text-grass-11"
              onSelect={() => {
                if (!selectedThread) return
                void updateThread({
                  threadId: selectedThread._id,
                  fields: { title: newThreadTitle },
                })
                setCurrentPage('threadConfig')
              }}
            >
              <Icons.Check weight="light" />
              Save
            </CmdkItem>
            <CmdkItem
              className="text-gray-11"
              onSelect={() => {
                setCurrentPage('threadConfig')
              }}
            >
              <Icons.CaretLeft weight="light" />
              Back
            </CmdkItem>
          </CmdkGroup>
        </>
      )
    },

    deleteThread: () => (
      <>
        <CmdkGroup heading="Delete thread">
          <CmdkItem
            className="text-red-11 aria-selected:text-red-11"
            onSelect={() => {
              if (!selectedThread) return
              void removeThread({ threadId: selectedThread._id })
              setSelectedThreadId(null)
              setCurrentPage('main')
            }}
          >
            <Icons.Trash weight="light" />
            Confirm
          </CmdkItem>
          <CmdkItem
            className="text-gray-11"
            onSelect={() => {
              setCurrentPage('threadConfig')
            }}
          >
            <Icons.CaretLeft weight="light" />
            Back
          </CmdkItem>
        </CmdkGroup>
      </>
    ),
  }
  return (
    <div className="flex h-full max-h-[55vh] flex-col sm:max-h-none">
      {/* * header * */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-grayA-3 px-3">
        {selectedThread ? (
          <div className="flex items-center gap-1.5 truncate text-sm font-medium [&_svg]:shrink-0">
            <Icons.CaretRight className="size-5" />
            {selectedThread.model?.type === 'chat' ? (
              <Icons.Chat className="size-4" />
            ) : (
              <Icons.ImageSquare className="size-4" />
            )}
            {selectedThread.title ?? 'Untitled'}
          </div>
        ) : (
          <AppLogoName />
        )}
      </div>

      {/* * menu * */}
      <Cmdk
        onKeyDown={(e) => {
          // Escape goes to previous page (actually it closes dialog)
          // Backspace goes to previous page when search is empty
          // TODO fix - stops backspacing in other inputs
          // if (e.key === 'Escape' || (e.key === 'Backspace' && !searchValue)) {
          //   e.preventDefault()
          //   setSelectedThreadId(null)
          //   setCurrentPage('main')
          // }
        }}
      >
        <CmdkInput
          placeholder="Type a command or search..."
          className="border-b border-grayA-3"
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CmdkList>
          <CmdkEmpty>No results found.</CmdkEmpty>

          {page[currentPage]()}
        </CmdkList>
      </Cmdk>
    </div>
  )
}

export const CommandShell = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useAtom(commandShellOpenAtom)

  useKeyboardEvent('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault()
      setOpen(!open)
    }
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children ? <Dialog.Trigger>{children}</Dialog.Trigger> : null}
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
        <CommandShellMenu />
      </Dialog.Content>
    </Dialog.Root>
  )
}
