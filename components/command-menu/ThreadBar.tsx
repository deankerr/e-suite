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
import { useListViewerThreads, useThreadContent } from '@/lib/api'
import { mountInputBarAtom } from '@/lib/atoms'
import { useThreadParamSlug } from '@/lib/hooks'

import type { api } from '@/convex/_generated/api'
import type { Preloaded } from 'convex/react'

type ThreadBarProps = { preloadedList: Preloaded<typeof api.threads.query.listViewerThreads> }

export const ThreadBar = ({ preloadedList }: ThreadBarProps) => {
  const router = useRouter()
  const { threads, viewer } = useListViewerThreads(preloadedList)
  const slug = useThreadParamSlug()

  const focusedViewerThread = slug ? threads?.find((thread) => thread.slug === slug[0]) : undefined
  const focusedUnownedThread = useThreadContent(slug && !focusedViewerThread ? slug[0] : undefined)
  const focusedThread = focusedUnownedThread ?? focusedViewerThread

  const viewerIsOwner = viewer?._id === focusedThread?.owner._id
  const title = focusedThread?.title ?? 'No thread selected'

  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false)

  const [mountInputBar, toggleMountInputBar] = useAtom(mountInputBarAtom)

  return (
    <div className="w-full flex-center">
      <CommandMenu title={title} open={open} onOpenChange={setOpen}>
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
        <CommandItem
          onSelect={() => {
            const slugs = threads?.map((thread) => thread.slug) ?? []
            router.push(`/multi/${slugs.slice(0, 4).join('_')}`)
          }}
        >
          Open Multiview Latest
        </CommandItem>
        <CommandItem
          onSelect={() => {
            router.push(`/multi/uhhc1xyv_wll2xbt7_g7sgbo6g_u2ra3rpk`)
          }}
        >
          Open Multiview Select
        </CommandItem>

        {focusedViewerThread && viewerIsOwner && (
          <CommandGroup heading="Actions">
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
          {threads?.map((thread) => (
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
          threadId={focusedViewerThread?._id ?? ''}
          currentTitle={focusedViewerThread?.title}
          defaultOpen={true}
          onOpenChange={setEditTitleDialogOpen}
        />
      )}

      <DeleteThreadDialog
        threadId={focusedViewerThread?._id ?? ''}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => router.replace('/')}
      />
    </div>
  )
}
