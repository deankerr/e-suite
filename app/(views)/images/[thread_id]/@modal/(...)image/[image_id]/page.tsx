'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'

import { ImagePage } from '@/components/_v/ImagePage'
import { IconButton } from '@/components/ui/Button'

export default function Page({ params }: { params: { image_id: string } }) {
  const router = useRouter()
  return (
    <div className="absolute bottom-0 top-10 w-full bg-blackA-11 backdrop-blur">
      <div className="absolute -top-9 right-1">
        <IconButton aria-label="Close" variant="surface" onClick={() => router.back()}>
          <Icons.X size={18} />
        </IconButton>
      </div>
      <ImagePage params={params} />
    </div>
  )
}
