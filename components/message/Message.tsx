import { useState } from 'react'
import { DotsThree, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { Callout, DropdownMenu, IconButton } from '@radix-ui/themes'

import AudioPlayer from '@/components/audio/AudioPlayer'
import { Avatar } from '@/components/message/Avatar'
import { Editor } from '@/components/message/Editor'
import { ImageGallery } from '@/components/message/ImageGallery'
import { Markdown } from '@/components/message/Markdown'
import { TimeSinceLink } from '@/components/message/TimeSinceLink'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pre } from '@/components/util/Pre'
import { VoiceoverPlayer } from '@/components/voiceovers/VoiceoverPlayer'
import { hasActiveJobName } from '@/convex/shared/utils'
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
  // const { removeVoiceover } = useChat()

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const soundGeneration = message.inference?.type === 'sound-generation' ? message.inference : null

  const showChatLoader =
    hasActiveJobName(message.jobs, 'inference/chat-completion') && !message.content

  const role = textToImage ? 'images' : soundGeneration ? 'sounds' : message.role
  const name = textToImage
    ? textToImage.endpointModelId
    : soundGeneration
      ? 'elevenlabs/sound-generation'
      : message?.name ?? message.role

  const soundEffects = message.files?.filter((file) => file.type === 'sound_effect') ?? []
  const showSoundEffectLoader =
    hasActiveJobName(message.jobs, 'inference/sound-generation') && !soundEffects.length

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

                  {message.voiceover && (
                    <DropdownMenu.Item
                      color="red"
                      disabled
                      // onClick={() => void removeVoiceover({ messageId: message._id })}
                    >
                      Delete Voiceover
                    </DropdownMenu.Item>
                  )}

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

        {/* content */}
        <ImageGallery message={message} />

        {message.content && !editing && (
          <div className="max-w-full space-y-1 rounded-lg bg-grayA-2 p-2 sm:w-fit">
            <div className="prose prose-sm prose-stone prose-invert max-w-none prose-pre:p-0">
              <Markdown>{message.content}</Markdown>
            </div>

            {showTokenInfo && (
              <div className="text-[0.66rem] leading-3 text-gray-10">
                {message.content.length} characters, ~{Math.ceil(message.content.length / 3.5)}{' '}
                tokens
              </div>
            )}
          </div>
        )}

        {editing && <Editor message={message} onClose={() => setEditing(false)} />}

        {soundEffects.length > 0 && (
          <div className="max-w-full space-y-1 rounded-lg bg-grayA-2 p-3 sm:w-fit">
            {soundEffects.map((sfx) =>
              sfx.soundEffect ? (
                <AudioPlayer
                  key={sfx.id}
                  url={sfx.soundEffect.fileUrl}
                  titleText={sfx.soundEffect.text}
                />
              ) : null,
            )}
          </div>
        )}

        {(showChatLoader || showSoundEffectLoader) && (
          <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
            <LoadingSpinner variant="ping" className="mx-1 -mb-0.5 mt-0.5 w-5" />
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
