import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, IconButton } from '@radix-ui/themes'

import { MessageEditor } from '@/app/b/c/[thread]/_components/MessageEditor'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { ImageCard } from '@/components/images/ImageCard'
import { useLightbox } from '@/components/lightbox/hooks'
import { Marble, useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Markdown } from '@/components/message/Markdown'
import { Pre } from '@/components/util/Pre'
import { useViewerDetails } from '@/lib/queries'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  removeMessage,
  showNameAvatar = true,
  className,
  ...props
}: {
  message: EMessage
  removeMessage?: (args: { messageId: string }) => void
  showNameAvatar?: boolean
} & React.ComponentProps<'div'>) => {
  const { isOwner } = useViewerDetails(message.userId)
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const name = getMessageName(message)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  const marbleProps = useMarbleProperties(name)

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const openLightbox = useLightbox()
  return (
    <div
      {...props}
      className={cn(
        'grid shrink-0 grid-cols-[2rem_1fr_2rem]',
        'rounded-md border border-transparent hover:border-grayA-4',
        'box-content min-h-7 w-full text-sm',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        className,
      )}
    >
      {/* # left gutter # */}
      <div className="row-span-2 flex justify-center gap-4 pt-1.5 opacity-90">
        <div
          className={cn('absolute -top-2 bottom-1 w-px', showNameAvatar && 'inset-y-1.5')}
          style={{ backgroundColor: marbleProps[0].color }}
        />
        {showNameAvatar ? <Marble name={name} properties={marbleProps} size={16} /> : null}
      </div>

      {/* # name / text content # */}
      <div className="py-1">
        {/* * name * */}
        {showNameAvatar ? <span className={cn('font-medium text-accentA-11')}>{name} </span> : null}
        {/* * short message text * */}
        {!showEditor && text && text.length < 300 ? text : null}

        {/* * errors * */}
        {message.jobs
          .flatMap((job) => job.errors)
          .map(
            (error, i) =>
              error && (
                <div
                  key={i}
                  className="rounded-lg border border-red-10 px-2 py-1.5 text-xs text-red-11"
                >
                  {error.code} {error.message}
                </div>
              ),
          )}
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
        ) : null}
      </div>

      {/* * editor */}
      {showEditor && (
        <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
      )}

      {/* * markdown text */}
      {!showEditor && text && text.length >= 300 ? (
        <Markdown text={text} className="col-start-2" />
      ) : null}

      {/* # images # */}
      {message.images.length > 0 ? (
        <div className="col-start-2 flex flex-wrap justify-center gap-2 py-1">
          {message.images.map((image) => (
            <div
              className="w-full max-w-[45%]"
              key={image._id}
              onClick={() => {
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
              }}
            >
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      ) : null}

      {/* # audio # */}
      {message.audio.length > 0 ? (
        <div className="col-start-2 space-y-1 rounded-lg bg-grayA-2 p-3 sm:w-fit">
          {message.audio.map((sfx) =>
            sfx.fileUrl ? (
              <AudioPlayer key={sfx._id} url={sfx.fileUrl} titleText={sfx.generationData.prompt} />
            ) : null,
          )}
        </div>
      ) : null}

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
