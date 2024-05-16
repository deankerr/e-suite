'use client'

import { useState } from 'react'
import { IconButton, Select, TextField } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { CheckIcon, FolderPenIcon, PlusCircleIcon, SquirrelIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Spinner } from '@/components/ui/Spinner'
import { api } from '@/convex/_generated/api'
import { useThreadMutations, useThreads } from '@/lib/api'
import { useRouteData } from '@/lib/hooks'
import { cn } from '@/lib/utils'

import type { PreloadedThreadsQuery } from '@/lib/api.server'

type TitleMenuButtonProps = { preloadedThreads: PreloadedThreadsQuery }

export const TitleMenuButton = ({}: TitleMenuButtonProps) => {
  const router = useRouter()
  const route = useRouteData()
  const threads = useThreads()

  const { remove, rename } = useThreadMutations()
  const completeTitle = useMutation(api.threads.mutate.completeThreadTitle)
  const [isRenamingThread, setIsRenamingThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')

  if (!threads)
    return (
      <div className="w-full gap-2 flex-center">
        <Spinner />
      </div>
    )

  const activeThread = threads.find((thread) => thread._id === route.thread)
  const id = activeThread?._id ?? ''

  return (
    <div className="w-full gap-2 flex-center">
      <IconButton variant="surface" onClick={() => void completeTitle({ threadId: id })}>
        <SquirrelIcon />
      </IconButton>

      <IconButton variant="ghost" onClick={() => router.push('/')}>
        <PlusCircleIcon />
      </IconButton>

      {isRenamingThread && (
        <TextField.Root
          className="w-full max-w-96"
          placeholder="set new thread title"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
      )}

      <Select.Root
        value={id}
        onValueChange={(id) => {
          router.push(`/t/${id}`)
        }}
      >
        <Select.Trigger
          className={cn('w-full max-w-96 text-center [&>span]:grow', isRenamingThread && 'hidden')}
          placeholder="no thread"
        />

        <Select.Content position="popper">
          {threads.map((thread) => (
            <Select.Item key={thread._id} value={thread._id}>
              {thread.title ?? <span className="italic text-gray-11">New thread</span>}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* rename */}
      {isRenamingThread ? (
        <IconButton
          variant="ghost"
          color="grass"
          onClick={() => {
            setIsRenamingThread(false)
            if (!newThreadTitle || newThreadTitle === activeThread?.title) return
            rename(id, newThreadTitle)
          }}
        >
          <CheckIcon />
        </IconButton>
      ) : (
        <IconButton
          variant="ghost"
          onClick={() => {
            setIsRenamingThread(true)
            setNewThreadTitle(activeThread?.title ?? '')
          }}
        >
          <FolderPenIcon />
        </IconButton>
      )}

      {/* delete */}
      <IconButton
        variant="ghost"
        color="red"
        onClick={() => {
          remove(id)
          router.push('/')
        }}
      >
        <Trash2Icon />
      </IconButton>
    </div>
  )
}
