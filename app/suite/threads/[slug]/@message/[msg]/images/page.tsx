'use client'

import { useRouter } from 'next/navigation'

import { Image } from '@/components/images/Image'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { Message } from '@/components/message/Message'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/panel/Panel'
import { Link } from '@/components/ui/Link'
import { getMessageName, getMessageText } from '@/convex/shared/helpers'
import { useMessage } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { EMessage, EThread } from '@/convex/types'

export default function Page() {
  const path = useSuitePath()
  const { thread, message } = useMessage(path.slug, path.msg)

  if (!path.msg) return null
  return (
    <Panel>
      {thread && message ? <Body thread={thread} message={message} /> : <LoadingPage />}
    </Panel>
  )
}

const Body = ({ thread, message }: { thread: EThread; message: EMessage }) => {
  const path = useSuitePath()
  const router = useRouter()

  const name = getMessageName(message)
  const text = getMessageText(message)
  return (
    <>
      <Panel.Header>
        <SidebarButton />
        <div className="size-4" />
        <Panel.Title>
          {thread.title} ⋅ {name} ⋅ {text} ⋅ <span className="text-accent-11"> Images</span>
        </Panel.Title>
        <Panel.CloseButton onClick={() => router.replace(path.threadPath)} />
      </Panel.Header>
      <Panel.ScrollAreaContent>
        <div className="space-y-2 p-2 text-sm">
          {message.images.map((image) => (
            <div key={image._id} className="flex">
              <div className="h-60 w-1/2 overflow-hidden">
                <Image
                  alt=""
                  src={`/i/${image.uid}`}
                  placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={image?.blurDataUrl}
                  style={{
                    objectFit: 'contain',
                  }}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>

              <div className="w-1/2">
                <div className="text-sm">{image.captionTitle}</div>
                <div className="text-xs">{image.captionDescription}</div>
                <Link href={`/suite/threads/${path.slug}/${path.msg}/images/${image.uid}`}>
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Panel.ScrollAreaContent>
    </>
  )
}
