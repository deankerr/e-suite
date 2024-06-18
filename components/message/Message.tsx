import { Fragment } from 'react'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { ImageIcon, LinkIcon, MessageSquareIcon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'

import { GoldSparkles } from '@/components/effects/GoldSparkles'
import { ImageCard } from '@/components/images/ImageCard'
import { VoiceoverButton } from '@/components/message/VoiceoverButton'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/shared/types'

export const Message = ({
  message,
  slug,
  removeMessage,
  className,
  ...props
}: {
  message: EMessage
  slug?: string
  removeMessage?: (messageId: string) => void
} & React.ComponentProps<'div'>) => {
  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.prompt : message?.name || message.role
  const Icon = textToImage ? ImageIcon : MessageSquareIcon

  return (
    <div {...props} className={cn('shrink-0 space-y-1 py-2 text-sm', className)}>
      <div className="gap-2 border-b px-1 font-medium flex-between">
        <div className="gap-2 flex-start">
          <MessageMenu message={message} removeMessage={removeMessage}>
            <IconButton variant="ghost">
              <Icon className="size-4" />
            </IconButton>
          </MessageMenu>
          <div className="truncate capitalize" onClick={() => console.log(message)}>
            {title}
          </div>

          <div className="text-xs text-gray-11">
            {formatDistanceToNow(new Date(message._creationTime), { addSuffix: true })}
          </div>
        </div>

        <div className="gap-2 flex-end">
          <VoiceoverButton message={message} />

          {slug && (
            <IconButton variant="ghost" color="gray" size="1">
              <Link href={`/c/${slug}/${message.series}`}>
                <LinkIcon className="size-5 scale-90" />
              </Link>
            </IconButton>
          )}
        </div>
      </div>

      {message.files && message.files.length > 0 && (
        <div
          className={cn(
            'mx-auto flex justify-center py-1',
            message.files.length > 1 ? 'grid grid-cols-2 gap-2' : '',
          )}
        >
          {message.files.map((file, i) => {
            if (file.type === 'image_url') {
              const width = textToImage?.width ?? 1024
              const height = textToImage?.height ?? 1024
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl"
                  style={{ aspectRatio: width / height, width: width, maxWidth: '100%' }}
                >
                  <GoldSparkles />
                </div>
              )
            }

            if (file.type === 'image') {
              return (
                <ImageCard
                  key={file.id}
                  image={file.image}
                  sizes="(max-width: 56rem) 50vw, 28rem"
                />
              )
            }
          })}
        </div>
      )}

      {message.content && (
        <div className="prose prose-sm prose-stone prose-invert mx-auto max-w-none px-1 prose-pre:p-0">
          <Markdown
            options={{
              wrapper: Fragment,
              disableParsingRawHTML: true,
              overrides: {
                code: SyntaxHighlightedCode,
              },
            }}
          >
            {message.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}

const MessageMenu = ({
  message,
  removeMessage,
  children,
}: {
  message: EMessage
  removeMessage?: (messageId: string) => void
  children: React.ReactNode
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Content variant="soft">
        {removeMessage && (
          <DropdownMenu.Item color="red" onClick={() => removeMessage(message._id)}>
            Delete
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
