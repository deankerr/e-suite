import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '@radix-ui/themes'
import { BoxIcon, ChevronLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react'

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
import { useModelData } from '@/lib/hooks'
import { endpointCode, getThreadConfig } from '@/lib/utils'

import type { EThread } from '@/convex/shared/types'

type ChatMenuProps = { thread: EThread } & React.ComponentProps<typeof Popover.Root>

export const Chat2Menu = ({ thread, ...props }: ChatMenuProps) => {
  const { getModel, chatModels, imageModels } = useModelData()
  const config = getThreadConfig(thread)
  const currentModel = getModel(config.current.endpoint, config.current.model)
  const modelsList = currentModel.modelType === 'chat' ? chatModels : imageModels

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')

  const { updateThreadConfig } = useChat()

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
        <Button variant="surface" size="1">
          {currentModel.name}
        </Button>
      </Popover.Trigger>

      <Popover.Content sideOffset={5} className="z-30 w-80">
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
                    value={`${model.name} ${model.endpoint}`}
                    onSelect={() => {
                      void updateThreadConfig({
                        currentInferenceConfig: {
                          ...config.current,
                          endpoint: model.endpoint,
                          model: model.endpointModelId,
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
        <DeleteThreadDialog threadId={thread._id} defaultOpen onClose={() => setDialog('')} />
      )}
    </Popover.Root>
  )
}
