'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Tooltip } from '@radix-ui/themes'
import Link from 'next/link'

import { AppLogo } from '@/components/icons/AppLogo'
import { UserButtons } from '@/components/layout/UserButtons'
import { useThreads } from '@/lib/api'

export const Nav2 = () => {
  const { threadsList } = useThreads()

  return (
    <div className="flex-col-start w-11 gap-4 rounded-md border bg-gray-1 py-2">
      <AppLogo className="size-6 text-accent-11" />

      <Tooltip content={'new'}>
        <Link href={'/new'} className="p-1">
          <Icons.NotePencil size={18} className="text-accentA-11" />
        </Link>
      </Tooltip>

      <div className="flex-col-center gap-1.5">
        {threadsList
          ?.filter((thread) => thread.slug !== 'new')
          .map((thread) => (
            <Tooltip key={thread._id} content={thread.title ?? 'Untitled'}>
              <Link
                href={getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })}
                className="p-1"
              >
                <ThreadIcon type={thread.latestRunConfig?.type} />
              </Link>
            </Tooltip>
          ))}
      </div>

      <UserButtons />
    </div>
  )
}

const ThreadIcon = ({ type = '' }: { type?: string }) => {
  switch (type) {
    case 'chat':
      return <Icons.Chat size={18} className="text-accentA-11" />
    case 'textToImage':
      return <Icons.Images size={18} className="text-accentA-11" />
    default:
      return <Icons.NotePencil size={18} className="text-accentA-11" />
  }
}

const getThreadPath = ({ slug, type = '' }: { type?: string; slug: string }) => {
  switch (type) {
    case 'chat':
      return `/chat/${slug}`
    case 'textToImage':
      return `/images/${slug}`
    default:
      return `/chat/${slug}`
  }
}
