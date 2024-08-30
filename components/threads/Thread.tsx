'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useQueryState } from 'nuqs'

import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { FavouriteButton } from '@/components/threads/FavouriteButton'
import { ThreadMenu } from '@/components/threads/ThreadMenu'
import { IconButton } from '@/components/ui/Button'
import { SearchField } from '@/components/ui/SearchField'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useThread } from '@/lib/api'
import { cn } from '@/lib/utils'

export const Thread = ({
  thread_id,
  children,
}: {
  thread_id: string
  children: React.ReactNode
}) => {
  return (
    <Section>
      <Header thread_id={thread_id} />
      {children}
    </Section>
  )
}

export const Header = ({ thread_id }: { thread_id: string }) => {
  const thread = useThread(thread_id)
  const [searchValue, setSearchValue] = useQueryState('search', {
    defaultValue: '',
    clearOnDefault: true,
  })

  const params = useParams()
  const pathname = usePathname()

  if (!thread) return <SectionHeader />
  return (
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

      <ThreadMenu thread_id={thread.slug} />
      <FavouriteButton thread_id={thread.slug} />
      <div className="grow" />

      <div className="max-w-[30%]">
        <SearchField
          value={searchValue}
          onValueChange={setSearchValue}
          className={cn(params.image_id && 'invisible')}
        />
      </div>
    </SectionHeader>
  )
}
