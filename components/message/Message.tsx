import { useState } from 'react'
import { DotsThree, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { Callout, DropdownMenu, IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Avatar } from '@/components/message/Avatar'
import { Editor } from '@/components/message/Editor'
import { ImageGallery } from '@/components/message/ImageGallery'
import { Markdown } from '@/components/message/Markdown'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Pre } from '@/components/util/Pre'
import { VoiceoverButton } from '@/components/voiceovers/VoiceoverButton'
import { api } from '@/convex/_generated/api'
import { hasActiveJobName } from '@/convex/shared/utils'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/shared/types'

export const Message = ({
  message,
  timeline = true,
  slug,
  removeMessage,
}: {
  message: EMessage
  timeline?: boolean
  slug?: string
  removeMessage?: (messageId: string) => void
}) => {
  const [showJson, setShowJson] = useState(false)
  const [editing, setEditing] = useState(false)
  const removeVoiceover = useMutation(api.db.voiceover.remove)

  const showChatLoader =
    hasActiveJobName(message.jobs, 'inference/chat-completion') && !message.content
  return (
    <div className="mx-auto flex w-full max-w-3xl gap-1.5 sm:gap-3">
      {/* timeline */}
      <div className="flex shrink-0 justify-center py-2">
        <div className={cn('absolute inset-y-0 w-0.5 bg-grayA-2', !timeline && 'hidden')}></div>

        {/* avatar */}
        <Avatar role={message.role} />
      </div>

      {/* message */}
      <div className="w-full space-y-1 py-2 text-sm">
        {/* title row */}
        <div className="flex gap-2">
          <div className="space-x-2">
            <span className="font-medium text-gray-11">{message.name ?? message.role}</span>
            <Link
              href={`/c/${slug}/${message.series}`}
              className="text-xs text-gray-11 hover:underline"
            >
              {formatDistanceToNow(new Date(message._creationTime), { addSuffix: true })}
            </Link>
          </div>

          <div>
            <VoiceoverButton
              message={message}
              variant="ghost"
              className={cn('-my-1 mx-0', !message.content && 'hidden')}
            />

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
                    onClick={() => void removeVoiceover({ messageId: message._id })}
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
          </div>
        </div>

        {/* content */}
        {message.content && !editing && (
          <div className="w-fit max-w-full space-y-1 rounded-lg bg-grayA-2 p-3">
            <div className="prose prose-sm prose-stone prose-invert max-w-none prose-pre:p-0">
              <Markdown>{message.content}</Markdown>
            </div>

            <div className="text-[0.66rem] leading-3 text-gray-10">
              {message.content.length} characters, ~{Math.ceil(message.content.length / 3.5)} tokens
            </div>
          </div>
        )}

        {editing && <Editor message={message} onClose={() => setEditing(false)} />}

        {showChatLoader && (
          <div className="w-fit max-w-full rounded-lg bg-grayA-2 p-2">
            <LoadingSpinner variant="ping" className="mx-1 -mb-0.5 mt-0.5 w-5" />
          </div>
        )}

        <ImageGallery message={message} />

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
