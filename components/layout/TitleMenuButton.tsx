'use client'

import { useState } from 'react'
import { IconButton, Select, TextField } from '@radix-ui/themes'
import { CheckIcon, FolderPenIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react'

import { usePreloadedThreads, useThreadMutations } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'
import type { PreloadedThreadsQuery } from '@/lib/api.server'

type TitleMenuButtonProps = { preloadedThreads: PreloadedThreadsQuery }

export const TitleMenuButton = ({ preloadedThreads }: TitleMenuButtonProps) => {
  const { create, remove, rename } = useThreadMutations()
  const { threads, activeThreadId, setActiveThreadId } = usePreloadedThreads(preloadedThreads)
  const activeThread = threads.find((thread) => thread._id === activeThreadId)

  const [isRenamingThread, setIsRenamingThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')

  return (
    <div className="w-full gap-2 flex-center">
      <IconButton variant="ghost" onClick={create}>
        <PlusCircleIcon />
      </IconButton>

      {isRenamingThread && (
        <TextField.Root
          className="w-full max-w-60"
          placeholder="set new thread title"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
      )}

      <Select.Root value={activeThreadId} onValueChange={setActiveThreadId}>
        <Select.Trigger
          className={cn('w-full max-w-60 text-center [&>span]:grow', isRenamingThread && 'hidden')}
        />

        <Select.Content position="popper">
          {threads.map((thread) => (
            <Select.Item key={thread._id} value={thread._id}>
              {thread.title ?? 'Untitled'}
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
            rename(activeThreadId, newThreadTitle)
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
          remove(activeThreadId as Id<'threads'>)
        }}
      >
        <Trash2Icon />
      </IconButton>
    </div>
  )
}
