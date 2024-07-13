import { useState } from 'react'
import { DotsThree, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { Callout, DropdownMenu, IconButton } from '@radix-ui/themes'
import Link from 'next/link'

import AudioPlayer from '@/components/audio/AudioPlayer'
import { Avatar } from '@/components/message/Avatar'
import { Editor } from '@/components/message/Editor'
import { ImageGallery } from '@/components/message/ImageGallery'
import { Markdown } from '@/components/message/Markdown'
import { TimeSinceLink } from '@/components/message/TimeSinceLink'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { VoiceoverPlayer } from '@/components/voiceovers/VoiceoverPlayer'
import { hasActiveJob } from '@/convex/shared/utils'
import { useViewerDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

const showTokenInfo = false

export const Message = ({
  message,
  showTimeline = false,
  slug,
  showMenu = true,
  removeMessage,
}: {
  message: EMessage
  showTimeline?: boolean
  slug?: string
  showMenu?: boolean
  removeMessage?: (messageId: string) => void
}) => {
  const [showJson, setShowJson] = useState(false)
  const [editing, setEditing] = useState(false)
  const { isOwner } = useViewerDetails(message.userId)

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const soundGeneration = message.inference?.type === 'sound-generation' ? message.inference : null

  const showChatLoader = hasActiveJob(message.jobs, 'inference/chat') && !message.text

  const role = textToImage ? 'images' : soundGeneration ? 'sounds' : message.role
  const name = textToImage
    ? textToImage.endpointModelId
    : soundGeneration
      ? 'elevenlabs/sound-generation'
      : message?.name ?? message.role

  const showSoundEffectLoader =
    hasActiveJob(message.jobs, 'inference/textToAudio') && !message.audio.length

  return (
    <div className="mx-auto flex w-full max-w-3xl gap-1.5 sm:gap-3">
      {/* timeline */}
      <div className="hidden shrink-0 justify-center py-2 sm:flex">
        <div className={cn('absolute inset-y-0 w-0.5 bg-grayA-2', !showTimeline && 'hidden')}></div>

        {/* avatar */}
        <Avatar role={role} />
      </div>

      {/* message */}
      <div className="w-full space-y-1 py-2 text-sm">
        {/* title row */}
        <div className="flex items-center gap-2">
          <Avatar role={role} className="flex sm:hidden" />

          <div className="space-x-1">
            <span className={cn('font-medium text-gray-11', !message.name && 'font-mono')}>
              {name}
            </span>
            <span className="text-gray-10">·</span>
            <TimeSinceLink time={message._creationTime} href={`/c/${slug}/${message.series}`} />
            <AdminOnlyUi>
              <span className="text-gray-10">·</span>
              <Link href={`/dev/image-page/${slug}/${message.series}`}>
                <span className="font-mono text-xs text-gray-10">#{message.series}</span>
              </Link>
            </AdminOnlyUi>
          </div>

          <div>
            <VoiceoverPlayer message={message} />

            {showMenu && isOwner && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" size="1" className="-my-1 mx-0" color="gray">
                    <DotsThree className="size-5 scale-110" weight="bold" />
                  </IconButton>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content variant="soft">
                  <DropdownMenu.Item onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel Edit' : 'Edit'}
                  </DropdownMenu.Item>

                  <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
                    Show JSON
                  </DropdownMenu.Item>

                  {removeMessage && (
                    <DropdownMenu.Item color="red" onClick={() => removeMessage(message._id)}>
                      Delete
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </div>
        </div>

        {/* message content */}
        {(showChatLoader || showSoundEffectLoader) && (
          <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
            <LoadingSpinner variant="ping" className="mx-1 -mb-0.5 mt-0.5 w-5" />
          </div>
        )}

        {/* text */}
        {message.text && !editing && (
          <div className="max-w-full space-y-1 rounded-lg bg-grayA-2 p-2 sm:w-fit">
            <div className="prose prose-sm prose-stone prose-invert max-w-none prose-pre:p-0">
              <Markdown text={message.text} />
            </div>

            {showTokenInfo && (
              <div className="text-[0.66rem] leading-3 text-gray-10">
                {message.text.length} characters, ~{Math.ceil(message.text.length / 3.5)} tokens
              </div>
            )}
          </div>
        )}

        {editing && <Editor message={message} onClose={() => setEditing(false)} />}

        {/* images */}
        {textToImage && (
          <div className="max-w-full space-y-1 rounded-lg bg-grayA-2 p-2 sm:w-fit">
            {textToImage.prompt}
          </div>
        )}
        <ImageGallery message={message} />

        {message.audio.length > 0 && (
          <div className="max-w-full space-y-1 rounded-lg bg-grayA-2 p-3 sm:w-fit">
            {message.audio.map((sfx) =>
              sfx.fileUrl ? (
                <AudioPlayer
                  key={sfx._id}
                  url={sfx.fileUrl}
                  titleText={sfx.generationData.prompt}
                />
              ) : null,
            )}
          </div>
        )}

        {message.jobs
          .flatMap((job) => job.errors)
          .map(
            (error, i) =>
              error && (
                <Callout.Root key={i} color="red" size="1">
                  <Callout.Icon>
                    <WarningCircle className="size-5" />
                  </Callout.Icon>
                  <Callout.Text className="border-b border-red-6 pb-1">{error.code}</Callout.Text>
                  <Callout.Text>{error.message}</Callout.Text>
                </Callout.Root>
              ),
          )}

        {showJson && <Pre>{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
