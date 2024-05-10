'use client'

import Link from 'next/link'

import { useUserThreadsList } from '@/app/gents/api'

type HomePageProps = { props?: unknown }

export const HomePage = ({}: HomePageProps) => {
  const threads = useUserThreadsList()
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter">Global Entities Test Home</h1>

      <h2>Threads</h2>
      <div className="space-y-1">
        {threads.map((thread) => (
          <Link key={thread._id} href={`/gents/t/${thread.rid}`} className="block underline">
            {thread.title ?? 'untitled'}
          </Link>
        ))}
      </div>
    </div>
  )
}
