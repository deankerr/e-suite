import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { BoxIcon, ChevronLeftIcon, PencilIcon, SpeechIcon, Trash2Icon } from 'lucide-react'

import { useChat } from '@/components/chat/ChatProvider'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { DeleteThreadDialog, UpdateThreadTitleDialog } from '@/components/ui/dialogs'
import { useChatModels, useImageModels, useVoiceModels } from '@/lib/queries'
import { endpointCode } from '@/lib/utils'

import type { EThread } from '@/convex/shared/types'

type ChatMenuProps = { thread: EThread } & React.ComponentProps<typeof Popover.Root>

export const ChatMenu = ({ thread, children, ...props }: ChatMenuProps) => {
  const chatModels = useChatModels()
  const imageModels = useImageModels()
  const voiceModels = useVoiceModels()

  const config = thread.inference

  const currentModel =
    config.type === 'chat-completion'
      ? chatModels?.find((model) => model.resourceKey === config.resourceKey)
      : imageModels?.find((model) => model.resourceKey === config.resourceKey)

  const modelList = config.type === 'chat-completion' ? chatModels : imageModels

  const currentDefaultVoiceModel = voiceModels?.find(
    (model) => model.resourceKey === thread.voiceovers?.default,
  )

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')

  const { updateThread } = useChat()
  const isNewChat = thread.slug.startsWith('_')

  return (
    <Popover.Root
      {...props}
      open={open}
      onOpenChange={(open) => {
        if (open) setPage('')
        setOpen(open)
      }}
    >
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Content align="start" alignOffset={0} sideOffset={5} className="z-30 w-80">
        <Command>
          {page === 'listModels' && <CommandInput value={search} onValueChange={setSearch} />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {!page && (
              <>
                <CommandGroup heading={`Actions: ${thread.title ?? 'new thread'}`}>
                  {!isNewChat && (
                    <>
                      <CommandItem onSelect={() => setDialog('updateTitle')}>
                        <PencilIcon className="mr-2 size-4" />
                        Edit Title
                      </CommandItem>
                      <CommandItem onSelect={() => setDialog('deleteThread')}>
                        <Trash2Icon className="mr-2 size-4" />
                        Delete Thread
                      </CommandItem>
                    </>
                  )}
                  <CommandItem value="model menu" onSelect={() => setPage('listModels')}>
                    <BoxIcon className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">{currentModel?.name ?? 'Model'}</div>
                    <div className="text-xs text-gray-10">change</div>
                  </CommandItem>

                  <CommandItem value="voice model menu" onSelect={() => setPage('listVoiceModels')}>
                    <SpeechIcon className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">
                      {currentDefaultVoiceModel
                        ? `${currentDefaultVoiceModel.creatorName}: ${currentDefaultVoiceModel.name}`
                        : 'Voice Model'}
                    </div>
                    <div className="text-xs text-gray-10">change</div>
                  </CommandItem>
                </CommandGroup>
              </>
            )}

            {page === 'listModels' && (
              <>
                <CommandItem onSelect={() => setPage('')} className="text-gray-10">
                  <ChevronLeftIcon className="mr-2 size-4" />
                  return
                </CommandItem>

                {modelList?.map((model) => (
                  <CommandItem
                    key={model._id}
                    value={`${model.name} ${model.endpoint}`}
                    onSelect={() => {
                      void updateThread({
                        inference: {
                          ...config,
                          resourceKey: model.resourceKey,
                          endpoint: model.endpoint,
                          endpointModelId: model.endpointModelId,
                        },
                      })
                      setOpen(false)
                    }}
                  >
                    <div className="grow truncate">{model.name}</div>
                    <div className="shrink-0 text-xs text-gray-10">
                      {endpointCode(model.endpoint)}
                    </div>
                  </CommandItem>
                ))}
              </>
            )}

            {page === 'listVoiceModels' && (
              <>
                <CommandItem onSelect={() => setPage('')} className="text-gray-10">
                  <ChevronLeftIcon className="mr-2 size-4" />
                  return
                </CommandItem>

                {voiceModels?.map((model) => (
                  <CommandItem
                    key={model.resourceKey}
                    value={`${model.name} ${model.endpoint}`}
                    onSelect={() => {
                      void updateThread({
                        voiceovers: {
                          ...thread.voiceovers,
                          default: model.resourceKey,
                        },
                      })
                      setOpen(false)
                    }}
                  >
                    <div className="grow truncate">{model.name}</div>
                    <div className="shrink-0 text-xs text-gray-10">
                      {endpointCode(model.endpoint)}
                    </div>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </Popover.Content>

      {dialog === 'updateTitle' && (
        <UpdateThreadTitleDialog thread={thread} defaultOpen onClose={() => setDialog('')} />
      )}
      {dialog === 'deleteThread' && (
        <DeleteThreadDialog
          threadId={thread._id}
          defaultOpen
          // onSuccess={() => closeChat?.()}
          onClose={() => setDialog('')}
        />
      )}
    </Popover.Root>
  )
}
