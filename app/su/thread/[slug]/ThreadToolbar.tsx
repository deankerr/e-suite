'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import * as Toolbar from '@radix-ui/react-toolbar'
import Link from 'next/link'
import { useQueryState } from 'nuqs'

import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { Button, IconButton } from '@/components/ui/Button'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { useThreads } from '@/lib/api'

export const ThreadToolbar = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)

  const [roleFilter, setRoleFilter] = useQueryState('role')
  const [showJson, setShowJson] = useState(false)

  return (
    <Toolbar.Root className="flex-start h-10 shrink-0 border-b border-gray-5 px-1">
      <Toolbar.Link asChild>
        <Link
          href={`/su/thread/${slug}/images`}
          aria-label="View images"
          className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3"
        >
          <Icons.Images size={20} />
        </Link>
      </Toolbar.Link>

      <Toolbar.Separator className="mx-2 h-3/4 w-px bg-grayA-3" />

      <Toolbar.ToggleGroup
        type="single"
        aria-label="Role"
        value={roleFilter || ''}
        onValueChange={(value) => {
          setRoleFilter(value || null)
        }}
      >
        <Toolbar.ToggleItem
          value="user"
          aria-label="View user messages"
          className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
        >
          <Icons.User size={20} />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          value="assistant"
          aria-label="View assistant messages"
          className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
        >
          <Icons.Robot size={20} />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>

      <Toolbar.Separator className="mx-2 h-3/4 w-px bg-grayA-3" />

      <div className="flex-start gap-2">
        <Toolbar.Button asChild>
          <TextEditorDialog slug={thread?.slug ?? ''}>
            <Button variant="soft" color="gray" size="1" aria-label="View/edit instructions">
              Instructions
            </Button>
          </TextEditorDialog>
        </Toolbar.Button>

        <AdminOnlyUi>
          <Toolbar.Button asChild>
            <IconButton
              aria-label="Show JSON"
              variant="ghost"
              color={showJson ? undefined : 'gray'}
              onClick={() => setShowJson(!showJson)}
            >
              <Icons.FileJs size={20} />
            </IconButton>
          </Toolbar.Button>
        </AdminOnlyUi>
      </div>
    </Toolbar.Root>
  )
}

/* 
 <Toolbar.ToggleGroup
        type="single"
        aria-label="View"
        value={viewFilter === 'images' ? 'images' : ''}
        onValueChange={(value) => {
          setViewFilter(value || null)
        }}
        className="pl-1"
      >
        <Toolbar.ToggleItem
          value="images"
          aria-label="View images"
          className="inline-flex size-8 items-center justify-center rounded-md text-grayA-11 hover:bg-grayA-3 data-[state=on]:bg-accentA-4 data-[state=on]:text-accentA-11"
        >
          <Icons.Images size={20} />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
*/
