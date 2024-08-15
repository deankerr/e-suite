'use client'

import { ImageDetailsPage } from '@/components/pages/ImageDetailsPage'
import { AppTitle } from '@/components/ui/AppTitle'
import { useImage } from '@/lib/api'

export default function Page({ params }: { params: { uid: string } }) {
  const image = useImage(params.uid)

  return (
    <div className="flex h-dvh flex-col p-1">
      <div className="flex-start h-12 shrink-0 rounded-md border border-transparent px-3">
        <AppTitle />
      </div>
      <div className="grow overflow-hidden">{image && <ImageDetailsPage image={image} />}</div>
    </div>
  )
}
