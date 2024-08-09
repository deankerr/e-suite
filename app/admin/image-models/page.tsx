'use client'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { useModels } from '@/lib/api'

export default function Page() {
  const { imageModels = [] } = useModels()

  return (
    <AdminPageWrapper className="">
      <div className="flex gap-3">
        <div className="flex grow flex-wrap gap-2">
          {imageModels.map((model) => (
            <ImageModelCard key={model._id} model={model} />
          ))}
        </div>
      </div>
    </AdminPageWrapper>
  )
}
