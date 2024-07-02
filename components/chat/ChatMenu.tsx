import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Popover from '@radix-ui/react-popover'

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

import type { EThread } from '@/convex/types'

type ChatMenuProps = { thread: EThread } & React.ComponentProps<typeof Popover.Root>

export const ChatMenu = ({ thread, children, ...props }: ChatMenuProps) => {
  const chatModels = useChatModels()
  const imageModels = useImageModels()
  const voiceModels = useVoiceModels()

  const config = thread.inference
  const uiMode = config.type === 'chat-completion' ? 'chat' : 'image'

  const currentModel =
    config.type === 'chat-completion'
      ? chatModels?.find((model) => model.resourceKey === config.resourceKey)
      : imageModels?.find((model) => model.resourceKey === config.resourceKey)

  const currentDefaultVoiceModel = voiceModels?.find(
    (model) => model.resourceKey === thread.voiceovers?.default,
  )

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')

  const { updateThread, setChatInferenceConfig, setImageInferenceConfig } = useChat()
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
          {page.startsWith('list') && <CommandInput value={search} onValueChange={setSearch} />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {!page && (
              <>
                <CommandGroup heading={`Actions: ${thread.title ?? 'new thread'}`}>
                  {!isNewChat && (
                    <>
                      <CommandItem onSelect={() => setDialog('updateTitle')}>
                        <Icons.Pencil className="mr-2 size-4" />
                        Edit Title
                      </CommandItem>
                      <CommandItem onSelect={() => setDialog('deleteThread')}>
                        <Icons.Trash className="mr-2 size-4" />
                        Delete Thread
                      </CommandItem>
                    </>
                  )}
                  <CommandItem
                    value="model menu"
                    onSelect={() =>
                      setPage(uiMode === 'chat' ? 'listChatModels' : 'listImageModels')
                    }
                  >
                    <Icons.CodesandboxLogo className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">{currentModel?.name ?? 'Model'}</div>
                    <div className="text-xs text-gray-10">change</div>
                  </CommandItem>

                  <CommandItem value="voice model menu" onSelect={() => setPage('listVoiceModels')}>
                    <Icons.UserSound className="mr-2 size-4" />
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

            {page === 'listChatModels' && (
              <>
                <CommandItem onSelect={() => setPage('')} className="text-gray-10">
                  <Icons.CaretLeft className="mr-2 size-4" />
                  return
                </CommandItem>
                <CommandItem onSelect={() => setPage('listImageModels')} className="text-gray-10">
                  <Icons.Swap className="mr-2 size-4" />
                  show image models
                </CommandItem>

                {chatModels?.map((model) => (
                  <CommandItem
                    key={model._id}
                    value={`${model.name} ${model.endpoint}`}
                    onSelect={() => {
                      setChatInferenceConfig({
                        resourceKey: model.resourceKey,
                        endpoint: model.endpoint,
                        endpointModelId: model.endpointModelId,
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

            {page === 'listImageModels' && (
              <>
                <CommandItem onSelect={() => setPage('')} className="text-gray-10">
                  <Icons.CaretLeft className="mr-2 size-4" />
                  return
                </CommandItem>
                <CommandItem onSelect={() => setPage('listChatModels')} className="text-gray-10">
                  <Icons.Swap className="mr-2 size-4" />
                  show chat models
                </CommandItem>

                {imageModels?.map((model) => (
                  <CommandItem
                    key={model._id}
                    value={`${model.name} ${model.endpoint}`}
                    onSelect={() => {
                      setImageInferenceConfig({
                        resourceKey: model.resourceKey,
                        endpoint: model.endpoint,
                        endpointModelId: model.endpointModelId,
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
                  <Icons.CaretLeft className="mr-2 size-4" />
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
