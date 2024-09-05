'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useCollections } from '@/app/lib/api/collections'
import { CreateCollectionDialog } from '@/components/collections/dialogs'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { cn } from '@/lib/utils'

export const CollectionsNavPanel = () => {
  const collections = useCollections()
  const params = useParams()

  return (
    <NavPanel>
      <PanelHeader>
        <NavigationButton />

        <PanelTitle href="/collections">Collections</PanelTitle>

        <div className="grow" />

        <CreateCollectionDialog>
          <Button variant="surface">
            Create <Icons.Plus size={18} />
          </Button>
        </CreateCollectionDialog>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {collections?.map((collection) => (
            <Link
              key={collection._id}
              href={`/collections/${collection.id}`}
              className={cn(
                'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
                collection.id === params.collectionId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {collection.title}
            </Link>
          ))}
        </div>
      </VScrollArea>
    </NavPanel>
  )
}
