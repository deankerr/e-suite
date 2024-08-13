import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, DropdownMenu } from '@radix-ui/themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { DotsThreeX } from '@/components/icons/DotsThreeX'
import { useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Gallery } from '@/components/message/Gallery'
import { Markdown } from '@/components/message/Markdown'
import { MessageEditor } from '@/components/message/MessageEditor'
import { ThreadOwner } from '@/components/thread-panel/ThreadOwner'
import { IconButton } from '@/components/ui/Button'
import { ErrorCallout } from '@/components/ui/Callouts'
import { Link } from '@/components/ui/Link'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pre } from '@/components/util/Pre'
import { getMessageName, getMessageText } from '@/convex/shared/helpers'
import { useDeleteMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

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
  deepLinkUrl,
  hideTimeline = false,
  isSequential = false,
  priority = false,
  withText,
  className,
  ...props
}: {
  message: EMessage
  deepLinkUrl?: string
  hideTimeline?: boolean
  isSequential?: boolean
  priority?: boolean
  withText?: string
} & React.ComponentProps<'div'>) => {
  const router = useRouter()

  const name = getMessageName(message) || message.role
  const text = getMessageText(message)
  const marbleProps = useMarbleProperties(name)
  const hasImageContent = message.images.length > 0 || message.contentType === 'image'

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const deleteMessage = useDeleteMessage()
  const messageId = message._id
  const dropdownMenu = useMemo(
    () =>
      message.userIsViewer ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="1" color="gray" aria-label="More">
              <DotsThreeX width={20} height={20} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft" align="end">
            {deepLinkUrl && (
              <DropdownMenu.Item onClick={() => router.push(deepLinkUrl)}>Link</DropdownMenu.Item>
            )}
            <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? 'Cancel Edit' : 'Edit'}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>Show JSON</DropdownMenu.Item>
            <DropdownMenu.Item color="red" onClick={() => deleteMessage({ messageId })}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null,
    [deepLinkUrl, deleteMessage, message.userIsViewer, messageId, router, showEditor, showJson],
  )

  return (
    <div
      {...props}
      className={cn(
        'flex min-h-7 w-full shrink-0 pr-2 @container/message',
        'rounded border border-transparent hover:border-grayA-4',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        className,
      )}
    >
      {/* > timeline */}
      <div className={cn('flex w-4 shrink-0 justify-center', hideTimeline && 'hidden')}>
        <div
          className={cn('absolute inset-y-1 w-px', isSequential && '-top-2.5')}
          style={{ backgroundColor: marbleProps[0].color }}
        />
      </div>

      {/* > content */}
      <div className="grow">
        {/* => menu */}
        <div className="flex-col-start absolute right-0 z-10">
          {dropdownMenu}
          {hasImageContent && deepLinkUrl ? (
            <Link href={deepLinkUrl} prefetch={false}>
              <IconButton variant="ghost" size="1" color="gray" aria-label="Link">
                <Icons.Share size={20} />
              </IconButton>
            </Link>
          ) : null}

          {hasImageContent && (
            <ThreadOwner>
              <IconButton variant="ghost" color="gray" aria-label="Copy" disabled>
                <Icons.Copy size={20} />
              </IconButton>
            </ThreadOwner>
          )}
        </div>

        <div className="markdown-body min-h-7 py-1 last:[&:nth-child(2)]:[&_p]:inline-block">
          {/* => name */}
          <div
            className={cn(
              'mb-0 mr-1 inline-block brightness-125 saturate-[.75]',
              isSequential && 'hidden',
            )}
            style={{ color: marbleProps[0].color }}
          >
            {name}
          </div>

          {/* => markdown text */}
          {!showEditor && text ? <Markdown text={text} /> : null}
        </div>

        {/* => editor */}
        {showEditor && (
          <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
        )}

        {/* => errors * */}
        {message.jobs.map(({ error }, i) =>
          error ? (
            <ErrorCallout
              key={i}
              title={error.code}
              message={error.message}
              size="1"
              className="mx-auto mb-1 max-w-xl"
            />
          ) : null,
        )}

        {/* => images  */}
        <Gallery message={message} priority={priority} />

        {/* => audio  */}
        {message.audio.length > 0 ? (
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
        ) : null}

        {/* => loading ping  */}
        {message.jobs.filter((job) => job.status === 'active' || job.status === 'pending').length >
          0 && (
          <div className="col-start-2">
            <LoadingSpinner variant="ping" />
          </div>
        )}

        {/* => json */}
        {showJson && <Pre className="max-w-screen-md">{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
