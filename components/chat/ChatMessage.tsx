import { Fragment } from 'react'
import { MessageSquareIcon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

import { ImageCard } from '@/components/images/ImageCard'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { cn } from '@/lib/utils'

import type { E_Message } from '@/convex/shared/types'

type ChatMessageProps = { message: E_Message } & React.ComponentProps<'div'>

export const ChatMessage = ({ message, className, ...props }: ChatMessageProps) => {
  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.parameters.prompt : message?.name || message.role

  return (
    <div {...props} className={cn('mx-auto w-full max-w-3xl py-2', className)}>
      <div className="gap-1.5 flex-start">
        <MessageSquareIcon className="size-4 flex-none text-accent-11" />
        <div className="grow truncate text-sm font-medium capitalize">{title}</div>
      </div>

      {message.files && message.files.length > 0 && (
        <div
          className={cn(
            'mx-auto grid w-full max-w-2xl justify-items-center gap-2 overflow-hidden py-1',
            message.files.length > 1 ? 'grid-cols-2' : '',
          )}
        >
          {message.files.map((file) => {
            if (file.type !== 'image') return null
            return (
              <ImageCard key={file.id} image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
            )
          })}
        </div>
      )}

      {message.content && (
        <div className="prose prose-stone prose-invert mx-auto max-w-none prose-pre:p-0">
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
