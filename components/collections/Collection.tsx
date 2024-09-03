'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'

import { useCollection } from '@/app/lib/api/collections'
import { DeleteCollectionDialog, EditCollectionTitleDialog } from '@/components/collections/dialogs'
import { DotsThreeFillX } from '@/components/icons/DotsThreeFillX'
import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useLightbox } from '@/components/lightbox/hooks'
import { NavigationSheet } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'

export const Collection = ({ collectionId }: { collectionId: string }) => {
  const collection = useCollection(collectionId)
  const openLightbox = useLightbox()

  if (collection === undefined) {
    return (
      <Section>
        <SectionHeader>Loading...</SectionHeader>
      </Section>
    )
  }

  if (!collection) {
    return <Section>Collection not found</Section>
  }

  return (
    <Section>
      <SectionHeader className="gap-1">
        <NavigationSheet>
          <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
            <Icons.List size={20} />
          </IconButton>
        </NavigationSheet>

        <Link href={`/collections/${collection.id}`} className="underline-offset-2 hover:underline">
          {collection.title}
        </Link>

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
      </SectionHeader>

      <ScrollArea scrollbars="vertical">
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
      </ScrollArea>
    </Section>
  )
}
