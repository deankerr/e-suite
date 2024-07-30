import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, DropdownMenu, IconButton } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { ImageCard } from '@/components/images/ImageCard'
import { ImageGeneratingEffect } from '@/components/images/ImageGeneratingEffect'
import { useLightbox } from '@/components/lightbox/hooks'
import { useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Markdown } from '@/components/message/Markdown'
import { MessageEditor } from '@/components/message/MessageEditor'
import { ErrorCallout } from '@/components/ui/Callouts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pre } from '@/components/util/Pre'
import { getMessageJobsDetails } from '@/convex/shared/utils'
import { useMessageMutations } from '@/lib/api'
import { useViewerDetails } from '@/lib/queries'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

const AudioPlayer = dynamic(() => import('@/components/audio/AudioPlayer'), {
  loading: () => (
    <Card className="mx-auto aspect-[8/5] w-80">
      <Skeleton className="absolute inset-0" />
    </Card>
  ),
})

export const Message = ({
  message,
  deeplink,
  showNameAvatar = true,
  showTimeline = true,
  className,
  ...props
}: {
  message: EMessage
  deeplink: string
  showNameAvatar?: boolean
  showTimeline?: boolean
} & React.ComponentProps<'div'>) => {
  const router = useRouter()
  const { isOwner } = useViewerDetails(message.userId)
  const jobs = getMessageJobsDetails(message.jobs)

  const { textToImageConfig } = getInferenceConfig(message.inference)
  const nImagePlaceholders =
    textToImageConfig && jobs.failed.length === 0 ? textToImageConfig.n - message.images.length : 0

  const name = getMessageName(message)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  const marbleProps = useMarbleProperties(name)

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const openLightbox = useLightbox()

  const { removeMessage } = useMessageMutations()
  return (
    <div
      {...props}
      className={cn(
        'grid shrink-0 grid-cols-[0.75rem_1fr_2rem]',
        'rounded-md border border-transparent hover:border-grayA-4',
        'box-content min-h-7 w-full max-w-3xl text-sm',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        className,
      )}
    >
      {/* # left gutter # */}
      <div className="row-span-2 flex gap-4 pt-1.5 opacity-80">
        {showTimeline && (
          <div
            className={cn('absolute -top-2 bottom-1 w-px', showNameAvatar && 'inset-y-1.5')}
            style={{ backgroundColor: marbleProps[0].color }}
          />
        )}
      </div>

      {/* # name / text content # */}
      <div className="py-1">
        {/* * name * */}
        {showNameAvatar ? <span className={cn('font-medium text-accentA-11')}>{name} </span> : null}

        {/* * short message text * */}
        {!showEditor && text && text.length < 300 ? text : null}

        {/* * errors * */}
        {jobs.failedJobErrors.map(({ code, message }, i) => (
          <ErrorCallout
            key={i}
            title={code}
            message={message}
            size="1"
            className="mx-auto max-w-xl"
          />
        ))}
      </div>

      {/* # right gutter # */}
      <div className="flex-end items-start">
        {isOwner ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" size="1" color="gray" className="m-0 size-7 p-0">
                <Icons.DotsThree size={24} />
              </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content variant="soft" align="end">
              <DropdownMenu.Item onClick={() => router.push(deeplink)}>Link</DropdownMenu.Item>

              <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
                {showEditor ? 'Cancel Edit' : 'Edit'}
              </DropdownMenu.Item>

              <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
                Show JSON
              </DropdownMenu.Item>

              <DropdownMenu.Item
                color="red"
                disabled={!removeMessage}
                onClick={() => removeMessage?.({ messageId: message._id })}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : deeplink ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" size="1" color="gray" className="m-0 size-7 p-0">
                <Icons.DotsThree size={24} />
              </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content variant="soft" align="end">
              <DropdownMenu.Item onClick={() => router.push(deeplink)}>Link</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : null}
      </div>

      {/* * editor */}
      {showEditor && (
        <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
      )}

      {/* * markdown text */}
      {!showEditor && text && text.length >= 300 ? (
        <Markdown text={text} className="col-start-2 pb-2" />
      ) : null}

      {/* # images # */}
      {message.images.length > 0 || nImagePlaceholders > 0 ? (
        <div className="col-start-2 flex flex-wrap justify-center gap-2 py-1">
          {message.images.map((image) => (
            <ImageCard
              key={image._id}
              className="max-w-xs cursor-pointer"
              image={image}
              imageProps={{
                sizes: '(max-width: 410px) 90vw, 20rem',
                onClick: () => {
                  openLightbox({
                    slides: message.images.map((image) => ({
                      type: 'image',
                      src: image._id,
                      width: image.width,
                      height: image.height,
                      blurDataURL: image.blurDataUrl,
                    })),
                    index: message.images.indexOf(image),
                  })
                },
              }}
            />
          ))}

          {textToImageConfig &&
            [...Array(nImagePlaceholders)].map((_, i) => (
              <div key={i} className="w-full max-w-xs">
                <ImageGeneratingEffect
                  style={{
                    aspectRatio: textToImageConfig.width / textToImageConfig.height,
                    width: textToImageConfig.width,
                    maxWidth: '100%',
                  }}
                />
              </div>
            ))}
        </div>
      ) : null}

      {/* # audio # */}
      {message.audio.length > 0 ? (
        <div className="col-start-2 flex flex-wrap justify-center gap-2 py-1">
          {message.audio.map((sfx) =>
            sfx.fileUrl ? (
              <AudioPlayer key={sfx._id} url={sfx.fileUrl} titleText={sfx.generationData.prompt} />
            ) : null,
          )}
        </div>
      ) : null}

      {/* * loading ping * */}
      {jobs.active.length > 0 && (
        <div className="col-start-2">
          <LoadingSpinner variant="ping" />
        </div>
      )}

      {/* * json * */}
      {showJson && <Pre className="col-start-2">{JSON.stringify(message, null, 2)}</Pre>}
    </div>
  )
}

function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = getInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) return textToImageConfig.endpointModelId
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}
