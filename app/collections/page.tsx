'use client'

import { useState } from 'react'
import { Label } from '@radix-ui/react-label'
import { Button } from '@radix-ui/themes'
import { useMutation, usePaginatedQuery } from 'convex/react'

import { ImageCardNext } from '@/components/images/ImageCardNext'
import { useLightbox } from '@/components/lightbox/hooks'
import { Section, SectionHeader } from '@/components/ui/Section'
import { TextField } from '@/components/ui/TextField'
import { api } from '@/convex/_generated/api'

export default function Page() {
  const collections = usePaginatedQuery(api.db.collections.list, {}, { initialNumItems: 50 })
  const createCollection = useMutation(api.db.collections.create)
  const openLightbox = useLightbox()

  const [title, setTitle] = useState('')

  const handleCreate = async () => {
    if (!title) return
    await createCollection({ title })
    setTitle('')
  }

  return (
    <Section className="">
      <SectionHeader>Collections</SectionHeader>

      <div className="space-y-5 overflow-y-auto p-5">
        <div className="max-w-xs border p-2">
          <p>Create a new collection</p>
          <div className="flex-start gap-2">
            <Label>
              Title
              <TextField value={title} onValueChange={setTitle} />
            </Label>
            <Button className="mt-auto" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>

        {collections.results.map((collection) => (
          <div key={collection._id} className="rounded border p-2">
            <p>{collection.title}</p>
            <div className="flex flex-wrap gap-2">
              {collection.images.map((image, index) => (
                <ImageCardNext key={image._id} image={image}>
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() =>
                      openLightbox({
                        slides: collection.images.map((image) => ({
                          type: 'image',
                          src: image.fileUrl ?? '',
                          width: image.width,
                          height: image.height,
                          blurDataURL: image?.blurDataUrl,
                        })),
                        index,
                      })
                    }
                  />
                </ImageCardNext>
              ))}
            </div>
          </div>
        ))}

        {collections.results.length === 0 && <p>No collections found</p>}
      </div>
    </Section>
  )
}
