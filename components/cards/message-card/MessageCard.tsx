import React, { useState } from 'react'
import { IconButton } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, MoreHorizontalIcon } from 'lucide-react'

import { MessageCardFooter } from '@/components/cards/message-card/MessageCardFooter'
import { MessageCardShell } from '@/components/cards/message-card/MessageCardShell'
import { MessageDropdownMenu } from '@/components/cards/message-card/MessageDropdownMenu'
import { MessageImageContent } from '@/components/cards/message-card/MessageImageContent'
import { MessageTextContent } from '@/components/cards/message-card/MessageTextContent'
import { MessageTextEditor } from '@/components/cards/message-card/MessageTextEditor'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageCardProps = { message: EMessageWithContent } & React.ComponentProps<
  typeof MessageCardShell
>

export const MessageCard = ({ message, ...props }: MessageCardProps) => {
  const [showMessageEditor, setShowMessageEditor] = useState(false)

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.parameters.prompt : message?.name || message.role

  return (
    <MessageCardShell
      {...props}
      title={title}
      icon={textToImage ? ImageIcon : MessageSquareIcon}
      controls={
        <MessageDropdownMenu message={message} onEdit={() => setShowMessageEditor(true)}>
          <IconButton variant="ghost" size="1">
            <MoreHorizontalIcon className="size-4" />
          </IconButton>
        </MessageDropdownMenu>
      }
    >
      <div className="mt-3">
        <MessageImageContent message={message} />
        {showMessageEditor ? (
          <MessageTextEditor message={message} onClose={() => setShowMessageEditor(false)} />
        ) : (
          <MessageTextContent content={message.content} />
        )}

        {/* <pre className="text-wrap font-mono text-xs">{JSON.stringify(message, null, 2)}</pre> */}
      </div>

      <MessageCardFooter message={message} />
    </MessageCardShell>
  )
}

export const MessageCardSkeleton = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <Skeleton {...props} className={cn('aspect-video w-full border bg-grayA-2', className)}>
      <Skeleton className="h-8 animate-none rounded-b-none border-b bg-transparent" />
    </Skeleton>
  )
}
