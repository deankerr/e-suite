'use client'

import { Card, Inset } from '@radix-ui/themes'
import Image from 'next/image'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { imageModels } from '@/convex/shared/imageModels'
import { useModels } from '@/lib/api'

export default function Page() {
  const db = useModels()
  const imageModelsDb = db.imageModels ?? []

  return (
    <AdminPageWrapper className="bg-gray-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex grow flex-wrap gap-2">
          {imageModelsDb.map((model) => (
            <ImageModelCard key={model._id} model={model} />
          ))}
        </div>

        <div>
          <div className="flex h-fit shrink-0 flex-wrap gap-2">
            {imageModels.map((model) => (
              <Card key={model.modelId} className="w-80">
                <div className="flex gap-2">
                  <Inset side="left" className="aspect-square w-16 shrink-0">
                    <Image
                      src={model.coverImage}
                      alt={model.name}
                      fill
                      className="object-cover"
                      sizes="4rem"
                    />
                  </Inset>

                  <div>
                    <p className="text-sm font-medium">{model.name}</p>
                    <p className="line-clamp-2 text-xs text-gray-11">{model.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  )
}
