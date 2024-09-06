import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, DropdownMenu } from '@radix-ui/themes'
import { RiMoreFill } from '@remixicon/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { IImageCard } from '@/components/images/IImageCard'
import { useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Markdown } from '@/components/markdown/Markdown'
import { Pre } from '@/components/markdown/Pre'
import { MessageEditor } from '@/components/message/MessageEditor'
import { IconButton } from '@/components/ui/Button'
import { SkeletonPulse } from '@/components/ui/Skeleton'
import { getMessageName } from '@/convex/shared/helpers'
import { useDeleteMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

const AudioPlayer = dynamic(() => import('@/components/audio/AudioPlayer'), {
  loading: () => (
    <Card className="mx-auto aspect-[8/5] w-80">
      <SkeletonPulse className="absolute inset-0" />
    </Card>
  ),
})

export const Message = ({
  message,
  deepLinkUrl,
  hideTimeline = false,
  priority = false,
  withText,
  className,
  ...props
}: {
  message: EMessage
  deepLinkUrl?: string
  hideTimeline?: boolean
  priority?: boolean
  withText?: string
} & React.ComponentProps<'div'>) => {
  const name = getMessageName(message) || message.role
  const text = message.text
  const marbleProps = useMarbleProperties(name)

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const deleteMessage = useDeleteMessage()

  const dropdownMenu = useMemo(
    () =>
      message.userIsViewer ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="1" color="gray" aria-label="More">
              <RiMoreFill size={20} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft">
            <Link href={`/chats/${message.threadSlug}/${message.series}`}>
              <DropdownMenu.Item>
                <Icons.Share /> Link
              </DropdownMenu.Item>
            </Link>

            <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? 'Cancel Edit' : 'Edit'}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>Show JSON</DropdownMenu.Item>
            <DropdownMenu.Item
              color="red"
              onClick={() => deleteMessage({ messageId: message._id })}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null,
    [
      deleteMessage,
      message.userIsViewer,
      message.threadSlug,
      message.series,
      message._id,
      showEditor,
      showJson,
    ],
  )

  return (
    <div
      {...props}
      className={cn(
        'flex min-h-7 w-full shrink-0 pr-2 @container/message',
        'rounded border border-transparent',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        className,
      )}
    >
      {/* > timeline */}
      <div className={cn('flex w-4 shrink-0 justify-center', hideTimeline && 'hidden')}>
        <div
          className="absolute inset-y-1 w-px"
          style={{ backgroundColor: marbleProps[0].color }}
        />
      </div>

      {/* > content */}
      <div className="grow">
        <div className="flex-start gap-1">
          {/* => name */}
          <div className="brightness-125 saturate-[.75]" style={{ color: marbleProps[0].color }}>
            {name}
          </div>
          {/* => menu */}
          {dropdownMenu}
        </div>

        {!showEditor && text ? (
          <div className="markdown-body min-h-7 py-1">
            {/* => markdown text */}
            <Markdown text={text} />
          </div>
        ) : null}

        {/* => editor */}
        {showEditor && (
          <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
        )}

        {/* => errors * */}
        {/* {message.jobs.map(({ error }, i) =>
          error ? (
            <ErrorCallout
              key={i}
              title={error.code}
              message={error.message}
              size="1"
              className="mx-auto mb-1 max-w-xl"
            />
          ) : null,
        )} */}

        {/* => images  */}
        {message.images?.length ? (
          <div className="flex flex-wrap gap-2">
            {message.images.map((image) => (
              <div key={image._id}>
                <IImageCard
                  image={image}
                  sizes="(max-width: 410px) 20rem"
                  priority={priority}
                  className="h-72 w-auto [&>img]:object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        {/* => audio  */}
        {/* {message.audio.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 py-1">
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
        ) : null} */}

        {/* => loading ping  */}
        {/* {message.jobs.filter((job) => job.status === 'active' || job.status === 'pending').length >
          0 && (
          <div className="col-start-2">
            <LoadingSpinner variant="ping" />
          </div>
        )} */}

        {/* => json */}
        {showJson && <Pre className="max-w-screen-md">{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
