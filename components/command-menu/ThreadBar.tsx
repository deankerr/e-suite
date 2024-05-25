'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  KeyboardIcon,
  KeyboardOffIcon,
  MessagesSquareIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { CommandGroup, CommandItem, CommandMenu } from '@/components/command-menu/CommandMenu'
import { DeleteThreadDialog, EditThreadTitle } from '@/components/ui/dialogs'
import { usePreloadedThreads, useSelf } from '@/lib/api'
import { mountInputBarAtom } from '@/lib/atoms'
import { useRouteIndex } from '@/lib/hooks'

import type { PreloadedThreadsQuery } from '@/lib/api.server'

type ThreadBarProps = { preloadedThreads: PreloadedThreadsQuery }

export const ThreadBar = ({ preloadedThreads }: ThreadBarProps) => {
  const self = useSelf()
  const router = useRouter()
  const threads = usePreloadedThreads(preloadedThreads)

  const index = useRouteIndex()
  const activeThread = index.thread
    ? threads.find((thread) => thread.slug === index.thread)
    : undefined
  const viewerIsOwner = self?._id === activeThread?.user._id

  const title = index.thread ? activeThread?.title ?? 'Untitled' : 'No thread selected'

  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false)

  const [mountInputBar, toggleMountInputBar] = useAtom(mountInputBarAtom)
  return (
    <div className="w-full flex-center">
      <CommandMenu title={title} open={open} onOpenChange={setOpen}>
        {activeThread && viewerIsOwner && (
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => toggleMountInputBar()}>
              {mountInputBar ? (
                <>
                  <KeyboardOffIcon className="mr-2 size-4" />
                  Hide Input Bar
                </>
              ) : (
                <>
                  <KeyboardIcon className="mr-2 size-4" />
                  Show Input Bar
                </>
              )}
            </CommandItem>
            <CommandItem onSelect={() => setEditTitleDialogOpen(true)}>
              <PencilIcon className="mr-2 size-4" />
              Edit Title
            </CommandItem>
            <CommandItem
              className="text-red-11 aria-selected:text-red-11"
              onSelect={() => setDeleteDialogOpen(true)}
            >
              <Trash2Icon className="mr-2 size-4" />
              Delete Thread
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Threads">
          {threads.map((thread) => (
            <CommandItem
              key={thread._id}
              value={thread.slug}
              onSelect={(slug) => {
                router.push(`/t/${slug}`)
                setOpen(false)
              }}
            >
              <MessagesSquareIcon className="mr-2 size-4 shrink-0" />
              {thread.title ?? 'Untitled Thread'}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandMenu>

      {editTitleDialogOpen && (
        <EditThreadTitle
          threadId={activeThread?._id ?? ''}
          currentTitle={activeThread?.title}
          defaultOpen={true}
          onOpenChange={setEditTitleDialogOpen}
        />
      )}

      <DeleteThreadDialog
        threadId={activeThread?._id ?? ''}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => router.replace('/')}
      />
    </div>
  )
}
