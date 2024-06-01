import { useState } from 'react'
import { IconButton, Skeleton } from '@radix-ui/themes'
import { ImageIcon, MessageSquareIcon, MoreHorizontalIcon } from 'lucide-react'

import { MessageCardFooter } from '@/components/cards/message-card/MessageCardFooter'
import { MessageCardShell } from '@/components/cards/message-card/MessageCardShell'
import { MessageDropdownMenu } from '@/components/cards/message-card/MessageDropdownMenu'
import { MessageImageContent } from '@/components/cards/message-card/MessageImageContent'
import { MessageTextContent } from '@/components/cards/message-card/MessageTextContent'
import { MessageTextEditor } from '@/components/cards/message-card/MessageTextEditor'

import type { EMessageWithContent } from '@/convex/shared/structures'

type MessageCardProps = { message: EMessageWithContent }

export const MessageCard = ({ message }: MessageCardProps) => {
  const [showMessageEditor, setShowMessageEditor] = useState(false)

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.parameters.prompt : message?.name ?? message.role

  return (
    <MessageCardShell
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
        <MessageImageContent files={message.files} />
        {showMessageEditor ? (
          <MessageTextEditor message={message} onClose={() => setShowMessageEditor(false)} />
        ) : (
          <MessageTextContent content={message.content} />
        )}
      </div>

      <MessageCardFooter message={message} />
    </MessageCardShell>
  )
}

export const MessageCardSkeleton = () => {
  return (
    <Skeleton className="mx-auto min-h-32 w-full max-w-4xl">
      <Skeleton className="h-10 rounded-b-none" />
    </Skeleton>
  )
}
