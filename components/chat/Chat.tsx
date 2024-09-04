'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { Toolbar } from '@/components/chat/Toolbar'
import { Composer } from '@/components/composer/Composer'
import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useThread, useThreadActions } from '@/lib/api'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Section>) => {
  const thread = useThread(threadId)
  const pathname = usePathname()

  const actions = useThreadActions(threadId)

  if (!thread)
    return (
      <Section>
        <SectionHeader />
      </Section>
    )

  return (
    <Section {...props}>
      <SectionHeader>
        <NavigationSheet>
          <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
            <Icons.List size={20} />
          </IconButton>
        </NavigationSheet>

        <h1 className="truncate px-1 text-sm font-medium">
          <Link
            href={pathname.split('/').slice(0, 3).join('/')}
            className="underline-offset-4 hover:underline"
          >
            {thread.title ?? 'Untitled Thread'}
          </Link>
        </h1>

        <ChatMenu threadId={thread.slug} />
        <FavouriteButton threadId={thread.slug} />
        <div className="grow" />
      </SectionHeader>
      <Toolbar threadId={threadId} />
      {children}

      {thread.userIsViewer && (
        <Composer
          onSend={actions.send}
          loading={actions.state !== 'ready'}
          initialResourceKey={thread.latestRunConfig?.resourceKey}
        />
      )}
    </Section>
  )
}
