'use client'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { ImageModelCard } from '@/components/cards/ImageModelCard'
import { useImageModels } from '@/lib/queries'

export default function Page() {
  const imageModels = useImageModels()

  return (
    <AdminPageWrapper className="">
      <div className="flex gap-3">
        <div className="flex grow flex-wrap gap-2">
          {imageModels?.map((model) => <ImageModelCard key={model._id} model={model} />)}
        </div>
      </div>
    </AdminPageWrapper>
  )
}
