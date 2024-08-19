'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AppLogo } from '@/components/icons/AppLogo'
import { UserButtons } from '@/components/layout/UserButtons'
import { useThreads } from '@/lib/api'

const ThreadIcon = ({ type = '' }: { type?: string }) => {
  switch (type) {
    case 'chat':
      return <Icons.Chat size={20} className="text-accentA-11" />
    case 'textToImage':
      return <Icons.Images size={20} className="text-accentA-11" />
    default:
      return <Icons.NotePencil size={20} className="text-accentA-11" />
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

export const NavRail = () => {
  const { threadsList } = useThreads()
  const pathname = usePathname()

  return (
    <div className="z-10 w-11 shrink-0">
      <div className="group flex h-full w-11 flex-col items-start gap-1 overflow-hidden rounded-md border border-gray-5 bg-gray-1 transition-all hover:w-60">
        <Link
          href="/"
          aria-label="Go to home page"
          className="grid h-10 w-60 grid-cols-[2.75rem_12rem]"
        >
          <div className="flex-col-center">
            <AppLogo className="size-6 text-accent-11" />
          </div>

          <div className="flex items-center text-xl font-semibold leading-none tracking-tight">
            e<span className="text-lg leading-none">⋆</span>suite
          </div>
        </Link>

        <div className="flex flex-col gap-1.5">
          {threadsList
            ?.filter((thread) => thread.slug !== 'new')
            .map((thread) => (
              <Link
                key={thread._id}
                href={getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })}
                aria-current={
                  pathname ===
                  getThreadPath({ slug: thread.slug, type: thread.latestRunConfig?.type })
                    ? 'page'
                    : undefined
                }
                className="grid h-12 w-60 grid-cols-[2.75rem_12rem] py-1 font-medium opacity-90 hover:bg-grayA-2 aria-[current=page]:bg-grayA-3 aria-[current=page]:opacity-100"
              >
                <div className="flex justify-center">
                  <ThreadIcon type={thread.latestRunConfig?.type} />
                </div>

                <div className="line-clamp-2 select-none overflow-hidden text-sm opacity-0 group-hover:opacity-100">
                  {thread.title ?? 'Untitled'}
                </div>
              </Link>
            ))}
        </div>

        <div className="grow" />

        <div className="flex-col-center h-10 w-11 border-b border-gray-3">
          <UserButtons />
        </div>
      </div>
    </div>
  )
}
