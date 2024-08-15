'use client'

import { useRouter } from 'next/navigation'

import { Image } from '@/components/images/Image'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { EmptyPage } from '@/components/pages/EmptyPage'
import {
  ImageDetailsCards,
  ImageDetailsPage,
  ImageDetailsPicker,
} from '@/components/pages/ImageDetailsPage'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/panel/Panel'
import { useImage, useMessage } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

export default function Page({ params }: { params: { uid: string } }) {
  const router = useRouter()
  const image = useImage(params.uid)
  const path = useSuitePath()
  const { thread, message } = useMessage(path.slug, path.msg)

  if (image === null) {
    return (
      <Panel>
        <EmptyPage />
      </Panel>
    )
  }

  if (image === undefined) {
    return (
      <Panel>
        <LoadingPage />
      </Panel>
    )
  }

  return (
    <Panel>
      <Panel.Header>
        <SidebarButton />
        <div className="size-4" />
        <Panel.Title>
          {thread?.title ?? 'Untitled Thread'} ⋅ {image.captionTitle ?? 'Image'}
        </Panel.Title>
        <Panel.CloseButton
          onClick={() => router.push(`/suite/threads/${path.slug}/${path.msg}/images`)}
        />
      </Panel.Header>
      <Panel.Content>
        <div className="grid h-4/5 grid-cols-[1fr_24rem] gap-2 p-2 text-sm">
          <div
            className="overflow-hidden rounded-md border border-grayA-3"
            style={{ aspectRatio: image.width / image.height }}
          >
            <Image
              key={image._id}
              alt=""
              src={`/i/${image.uid}`}
              placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image?.blurDataUrl}
              style={{
                objectFit: 'contain',
                objectPosition: 'top',
              }}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          <div className="w-96 space-y-3 justify-self-center overflow-y-auto">
            <ImageDetailsCards image={image} />
          </div>
        </div>

        <div className="h-1/5 bg-grayA-1">
          {/* image picker */}
          <div className="flex-center h-full w-full">
            <ImageDetailsPicker images={message?.images ?? []} />
          </div>
        </div>
      </Panel.Content>
    </Panel>
  )
}
