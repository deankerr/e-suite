'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu } from '@radix-ui/themes'

import { useCollection } from '@/app/lib/api/collections'
import { DeleteCollectionDialog, EditCollectionTitleDialog } from '@/components/collections/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useLightbox } from '@/components/lightbox/hooks'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'

export const Collection = ({ collectionId }: { collectionId: string }) => {
  const collection = useCollection(collectionId)
  const openLightbox = useLightbox()

  if (collection === undefined) {
    return (
      <Panel>
        <PanelHeader>Loading...</PanelHeader>
      </Panel>
    )
  }

  if (!collection) {
    return <Panel>Collection not found</Panel>
  }

  return (
    <Panel>
      <PanelHeader className="gap-1">
        <NavigationButton />
        <PanelTitle href={`/collections/${collection.id}`}>{collection.title}</PanelTitle>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" aria-label="More options">
              <DotsThreeFillX width={20} height={20} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft">
            <EditCollectionTitleDialog collectionId={collection.id} currentTitle={collection.title}>
              <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                <Icons.Pencil /> Edit title
              </DropdownMenu.Item>
            </EditCollectionTitleDialog>

            <DeleteCollectionDialog collectionId={collection.id}>
              <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                <Icons.Trash /> Delete
              </DropdownMenu.Item>
            </DeleteCollectionDialog>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-wrap gap-2 p-2">
          {collection.images.map((image, index) => (
            <div key={image._id} className="w-72">
              <ImageCardNext image={image}>
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() =>
                    openLightbox({
                      slides: collection.images.map((image) => ({
                        type: 'image',
                        src: `/i/${image.id}`,
                        width: image.width,
                        height: image.height,
                        blurDataURL: image?.blurDataUrl,
                      })),
                      index,
                    })
                  }
                />
              </ImageCardNext>
            </div>
          ))}

          {collection.images.length === 0 && (
            <div className="text-gray-11">This collection is empty.</div>
          )}
        </div>
      </VScrollArea>
    </Panel>
  )
}
