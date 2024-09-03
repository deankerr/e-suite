'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useCollections } from '@/app/lib/api/collections'
import { CreateCollectionDialog } from '@/components/collections/dialogs'
import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

export const CollectionsList = () => {
  const collections = useCollections()
  const params = useParams()

  return (
    <Section className="w-80 shrink-0">
      <SectionHeader>
        <NavigationSheet>
          <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
            <Icons.List size={20} />
          </IconButton>
        </NavigationSheet>

        <Link href="/collections" className="underline-offset-2 hover:underline">
          Collections
        </Link>

        <div className="grow" />

        <CreateCollectionDialog>
          <Button variant="surface">
            Create <Icons.Plus size={18} />
          </Button>
        </CreateCollectionDialog>
      </SectionHeader>

      <ScrollArea scrollbars="vertical" className="grow">
        <div className="flex flex-col gap-1 p-1">
          {collections?.map((collection) => (
            <Link
              key={collection._id}
              href={`/collections/${collection.id}`}
              className={cn(
                'truncate rounded-sm border-gray-3 px-2 py-3 text-sm font-medium hover:bg-gray-2',
                collection.id === params.collectionId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {collection.title}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </Section>
  )
}
