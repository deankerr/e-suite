import { useMemo, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Card, DropdownMenu, IconButton } from '@radix-ui/themes'
import dynamic from 'next/dynamic'

import { DotsThreeX } from '@/components/icons/DotsThreeX'
import { useMarbleProperties } from '@/components/marble-avatar/Marble'
import { Gallery } from '@/components/message/Gallery'
import { Markdown } from '@/components/message/Markdown'
import { MessageEditor } from '@/components/message/MessageEditor'
import { ErrorCallout } from '@/components/ui/Callouts'
import { Link } from '@/components/ui/Link'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pre } from '@/components/util/Pre'
import { extractJobsDetails, getMessageName, getMessageText } from '@/convex/shared/helpers'
import { useMessageMutations } from '@/lib/api'
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
  className,
  ...props
}: {
  message: EMessage
  deepLinkUrl?: string
  hideTimeline?: boolean
  isSequential?: boolean
  priority?: boolean
} & React.ComponentProps<'div'>) => {
  const isOwner = message.user?.isViewer ?? false
  const jobs = extractJobsDetails(message.jobs)

  const name = getMessageName(message)
  const text = getMessageText(message)
  const marbleProps = useMarbleProperties(name)
  const shortMessageText = text && text.length < 300 ? text : undefined

  const [showJson, setShowJson] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const { removeMessage } = useMessageMutations()
  const messageId = message._id
  const dropdownMenu = useMemo(
    () =>
      isOwner ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="1" color="gray" className="m-0 shrink-0">
              <DotsThreeX />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft" align="end">
            <DropdownMenu.Item onClick={() => setShowEditor(!showEditor)}>
              {showEditor ? 'Cancel Edit' : 'Edit'}
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>Show JSON</DropdownMenu.Item>
            <DropdownMenu.Item
              color="red"
              disabled={!removeMessage}
              onClick={() => removeMessage?.({ messageId })}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null,
    [isOwner, messageId, removeMessage, showEditor, showJson],
  )

  return (
    <div
      {...props}
      className={cn(
        'flex min-h-7 w-full shrink-0 @container/message',
        'rounded-md border border-transparent hover:border-grayA-4',
        '',
        showEditor && 'border-dashed border-accentA-7 hover:border-accentA-8',
        className,
      )}
    >
      {/* * timeline * */}
      {!hideTimeline && (
        <div className="ml-px flex w-6 shrink-0 justify-center">
          <div
            className={cn('absolute inset-y-1 w-px', isSequential && '-top-2.5')}
            style={{ backgroundColor: marbleProps[0].color }}
          />
        </div>
      )}

      {/* * content * */}
      <div className="grow">
        {/* * header * */}
        <div className="flex justify-between">
          <div className="pt-1">
            <span
              className={cn(
                'mr-1 font-medium text-accentA-11',
                isSequential && message.role === 'user' && shortMessageText && 'hidden',
              )}
            >
              {name}{' '}
            </span>
            {shortMessageText}
          </div>

          {/* * buttons * */}
          <div className="flex shrink-0">
            {deepLinkUrl ? (
              <Link href={deepLinkUrl} prefetch={false}>
                <IconButton variant="ghost" size="1" color="gray" className="m-0 shrink-0">
                  <Icons.Share size={20} />
                </IconButton>
              </Link>
            ) : null}

            {dropdownMenu}
          </div>
        </div>

        {/* * errors * */}
        {jobs.failedJobErrors.map(({ code, message }, i) => (
          <ErrorCallout
            key={i}
            title={code}
            message={message}
            size="1"
            className="mx-auto mb-1 max-w-xl"
          />
        ))}

        {/* * editor */}
        {showEditor && (
          <MessageEditor message={message} onClose={() => setShowEditor(false)} className="pb-2" />
        )}

        {/* * markdown text */}
        {!showEditor && text && text.length >= 300 ? (
          <Markdown text={text} className="pb-2" />
        ) : null}

        {/* # images # */}
        <Gallery message={message} priority={priority} />

        {/* # audio # */}
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

        {/* * loading ping * */}
        {jobs.active.length > 0 && (
          <div className="col-start-2">
            <LoadingSpinner variant="ping" />
          </div>
        )}

        {/* * json * */}
        {showJson && <Pre className="max-w-screen-md">{JSON.stringify(message, null, 2)}</Pre>}
      </div>
    </div>
  )
}
