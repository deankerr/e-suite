'use client'

import { useState } from 'react'
import { IconButton, Select, TextField } from '@radix-ui/themes'
import { CheckIcon, FolderPenIcon, PlusCircleIcon, Trash2Icon, XIcon } from 'lucide-react'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'

import { Spinner } from '@/components/ui/Spinner'
import { usePreloadedThreads, useThreadMutations } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { PreloadedThreadsQuery } from '@/lib/api.server'

type TitleControlBarProps = { preloadedThreads: PreloadedThreadsQuery }

export const TitleControlBar = ({ preloadedThreads }: TitleControlBarProps) => {
  const router = useRouter()
  const threads = usePreloadedThreads(preloadedThreads)
  const [route, slugSegment] = useSelectedLayoutSegments()
  const slug = (route === 't' ? slugSegment : undefined) ?? ''

  const { remove, rename } = useThreadMutations()
  const [isRenamingThread, setIsRenamingThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')

  if (!threads)
    return (
      <div className="w-full gap-2 flex-center">
        <Spinner />
      </div>
    )

  const activeThread = threads.find((thread) => thread.slug === slug)

  return (
    <div className="w-full gap-2 flex-center">
      <IconButton
        className={cn(isRenamingThread && 'hidden')}
        variant="ghost"
        onClick={() => router.push('/')}
      >
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
        value={slug}
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
            <Select.Item key={thread._id} value={thread.slug}>
              {thread.title ?? <span className="italic text-gray-11">New thread</span>}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* rename */}
      {isRenamingThread ? (
        <>
          <IconButton
            variant="ghost"
            color="orange"
            onClick={() => {
              setIsRenamingThread(false)
            }}
          >
            <XIcon />
          </IconButton>
          <IconButton
            variant="ghost"
            color="grass"
            onClick={() => {
              setIsRenamingThread(false)
              if (!newThreadTitle || newThreadTitle === activeThread?.title) return
              rename(activeThread?._id ?? '', newThreadTitle)
            }}
          >
            <CheckIcon />
          </IconButton>
        </>
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
        className={cn(isRenamingThread && 'hidden')}
        variant="ghost"
        color="red"
        onClick={() => {
          remove(activeThread?._id ?? '')
          router.push('/')
        }}
      >
        <Trash2Icon />
      </IconButton>
    </div>
  )
}
