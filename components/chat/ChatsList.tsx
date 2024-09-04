'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useThreads } from '@/app/lib/api/threads'
import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

export const ChatsList = () => {
  const threads = useThreads()
  const params = useParams()

  return (
    <Section className="w-80 shrink-0">
      <SectionHeader>
        <NavigationSheet>
          <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
            <Icons.List size={20} />
          </IconButton>
        </NavigationSheet>

        <Link href="/chat" className="underline-offset-2 hover:underline">
          Chats
        </Link>

        <div className="grow" />

        <Button variant="surface">
          Create <Icons.Plus size={18} />
        </Button>
      </SectionHeader>

      <ScrollArea scrollbars="vertical" className="grow">
        <div className="flex flex-col gap-1 p-1">
          {threads?.map((thread) => (
            <Link
              key={thread._id}
              href={`/chat/${thread.slug}`}
              className={cn(
                'truncate rounded-sm border-gray-3 px-2 py-3 text-sm font-medium hover:bg-gray-2',
                thread.slug === params.threadId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {thread.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </Section>
  )
}
