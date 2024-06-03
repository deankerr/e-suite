import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { BoxIcon, ChevronLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react'

import { ChatMenuButton } from '@/components/chat-panel/ChatMenuButton'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { DeleteThreadDialog, UpdateThreadTitleDialog } from '@/components/ui/dialogs'
import { useUpdateThreadConfig } from '@/lib/api'
import { useModelData } from '@/lib/hooks'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatMenuProps = { thread: EThreadWithContent } & React.ComponentProps<typeof Popover.Root>

export const ChatMenu = ({ thread, ...props }: ChatMenuProps) => {
  const { getModel, chatModels, imageModels } = useModelData()
  const currentModel = getModel([thread.config.endpoint, thread.config.parameters.model])
  const modelsList = currentModel.modelType === 'chat' ? chatModels : imageModels
  // const textToImage = thread.config.type === 'text-to-image' ? thread.config : null
  // const chatCompletion = thread.config.type === 'chat-completion' ? thread.config : null

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')

  const { updateThreadConfig } = useUpdateThreadConfig()

  return (
    <Popover.Root
      {...props}
      open={open}
      onOpenChange={(open) => {
        if (open) setPage('')
        setOpen(open)
      }}
    >
      <Popover.Trigger asChild>
        <ChatMenuButton
          title={thread.title ?? 'new thread'}
          modelName={currentModel.name}
          className="mx-auto max-w-xl grow"
        />
      </Popover.Trigger>

      <Popover.Content align="center" sideOffset={5} className="w-80">
        <Command>
          <CommandInput value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {!page && (
              <>
                <CommandGroup heading={`Actions: ${thread.title ?? 'new thread'}`}>
                  <CommandItem onSelect={() => setDialog('updateTitle')}>
                    <PencilIcon className="mr-2 size-4" />
                    Edit Title
                  </CommandItem>
                  <CommandItem onSelect={() => setDialog('deleteThread')}>
                    <Trash2Icon className="mr-2 size-4" />
                    Delete Thread
                  </CommandItem>
                  <CommandItem onSelect={() => setPage('listModels')}>
                    <BoxIcon className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">{currentModel.name}</div>
                    <div className="text-xs text-gray-10">change</div>
                  </CommandItem>
                  {/* <CommandItem onSelect={() => setPage('listModels')}>
                    <BoxIcon className="mr-2 size-4" />
                    <div className="line-clamp-1 grow">Instructions</div>
                    <div className="text-xs text-gray-10">edit</div>
                  </CommandItem> */}
                </CommandGroup>

                {/* <CommandGroup heading="Threads">
                  <CommandItem onSelect={() => void createThread({ default: 'image' })}>
                    <ImageIcon className="mr-2 size-4" />
                    Create Image Thread
                  </CommandItem>
                  <CommandItem onSelect={() => void createThread({ default: 'chat' })}>
                    <MessagesSquareIcon className="mr-2 size-4" />
                    Create Chat Thread
                  </CommandItem>
                </CommandGroup> */}
              </>
            )}

            {page === 'listModels' && (
              <>
                <CommandItem onSelect={() => setPage('')} className="text-gray-10">
                  <ChevronLeftIcon className="mr-2 size-4" />
                  return
                </CommandItem>

                {modelsList.map((model) => (
                  <CommandItem
                    key={model.resourceId}
                    value={model.resourceId}
                    onSelect={(resourceId) => {
                      const model = getModel(resourceId)
                      updateThreadConfig({
                        threadId: thread.slug,
                        config: {
                          ...thread.config,
                          endpoint: model.endpoint,
                          resourceId: model.resourceId,
                          parameters: {
                            ...thread.config.parameters,
                            model: model.endpointModelId,
                          },
                        } as any,
                      })
                      setOpen(false)
                    }}
                  >
                    {model.name}
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
          threadId={thread.slug}
          defaultOpen
          // onSuccess={() => multi.remove(thread.slug)}
          onClose={() => setDialog('')}
        />
      )}
    </Popover.Root>
  )
}
