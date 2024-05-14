'use client'

import { IconButton, Select } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { EllipsisIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react'

import { Spinner } from '@/components/ui/Spinner'
import { useThreadMutations, useThreads } from '@/lib/api2'
import { activeThreadAtom } from '@/lib/atoms'

type TitleMenuButtonProps = { props?: unknown }

export const TitleMenuButton = ({}: TitleMenuButtonProps) => {
  const [activeThread, setActiveThread] = useAtom(activeThreadAtom)

  const { results: threads } = useThreads()
  const { create, remove } = useThreadMutations()

  if (!activeThread)
    return (
      <div className="flex w-full">
        <Spinner className="mx-auto" />
      </div>
    )

  return (
    <div className="w-full gap-2 flex-center">
      <IconButton variant="ghost" onClick={create}>
        <PlusCircleIcon />
      </IconButton>

      <Select.Root
        value={activeThread.rid}
        onValueChange={(rid) => {
          const nextThread = threads.find((thread) => thread.rid === rid)
          setActiveThread(nextThread)
        }}
      >
        <Select.Trigger className="w-full max-w-60 text-center [&>span]:grow" />

        <Select.Content position="popper">
          {threads.map((thread) => (
            <Select.Item key={thread._id} value={thread.rid}>
              {thread.title ?? 'Untitled'}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <IconButton variant="ghost" size="2">
        <EllipsisIcon />
      </IconButton>

      <IconButton
        variant="ghost"
        color="tomato"
        onClick={() => {
          remove(activeThread._id)
        }}
      >
        <Trash2Icon />
      </IconButton>
    </div>
  )
}
