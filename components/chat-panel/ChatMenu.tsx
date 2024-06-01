import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  BoxIcon,
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  DotIcon,
  ImageIcon,
  MessagesSquareIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { DeleteThreadDialog, UpdateThreadTitleDialog } from '@/components/ui/dialogs'
import { useCreateThread, useUpdateCurrentInferenceConfig } from '@/lib/api'
import { useModelData } from '@/lib/hooks'

import type { EThreadWithContent } from '@/convex/shared/structures'

type ChatMenuProps = { thread: EThreadWithContent } & React.ComponentProps<typeof Popover.Root>

export const ChatMenu = ({ thread, ...props }: ChatMenuProps) => {
  const { getModel, chatModels, imageModels } = useModelData()
  const inference = thread.active
  const currentModel = getModel([inference.endpoint, inference.parameters.model])
  const modelsList = currentModel.modelType === 'chat' ? chatModels : imageModels

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('')
  const [dialog, setDialog] = useState('')

  const updateConfig = useUpdateCurrentInferenceConfig()
  const createThread = useCreateThread()

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
        <button className="inline-flex grow items-center justify-center whitespace-nowrap rounded py-1 text-sm font-medium ring-accent-7 ring-offset-gray-1 transition-colors hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-8 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <div className="w-6 shrink-0">
            <DotIcon className="text-gray-12" />
          </div>
          <div className="grow">
            <div>{thread.title ?? 'new thread'}</div>
            <div className="font-normal text-gray-11">{currentModel.name}</div>
          </div>
          <div className="w-6 shrink-0">
            <ChevronsUpDownIcon className=" text-gray-10" />
          </div>
        </button>
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
                </CommandGroup>

                <CommandGroup heading="Threads">
                  <CommandItem onSelect={() => void createThread({ default: 'image' })}>
                    <ImageIcon className="mr-2 size-4" />
                    Create Image Thread
                  </CommandItem>
                  <CommandItem onSelect={() => void createThread({ default: 'chat' })}>
                    <MessagesSquareIcon className="mr-2 size-4" />
                    Create Chat Thread
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

                {modelsList.map((model) => (
                  <CommandItem
                    key={model.resourceId}
                    value={model.resourceId}
                    onSelect={(resourceId) => {
                      const [endpoint, endpointModelId] = resourceId.split('::')
                      if (!endpoint || !endpointModelId) return
                      updateConfig({
                        threadId: thread.slug,
                        inference: {
                          ...thread.active,
                          endpoint,
                          resourceId,
                          parameters: {
                            ...thread.active.parameters,
                            model: endpointModelId,
                          },
                        } as any,
                      })
                        .then(() => {
                          toast.success('Inference config updated')
                          setOpen(false)
                        })
                        .catch((err) => {
                          if (err instanceof Error) toast.error(err.message)
                          else toast.error('Failed to update config.')
                        })
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