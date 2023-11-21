import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Markdown } from '@/components/util/markdown'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const messageBubbleVariants = {
  container: {
    default: 'justify-center',
    user: 'justify-end',
    assistant: '',
  },
  content: {
    default: 'bg-secondary text-center text-secondary-foreground',
    user: 'bg-primary text-primary-foreground',
    assistant: 'bg-muted text-secondary-foreground',
  },
}

const variants = {
  container: (name: VariantProp) => messageBubbleVariants.container[name],
  content: (name: VariantProp) => messageBubbleVariants.content[name],
}

function getVariantKey(key: string): VariantProp {
  if (key in messageBubbleVariants.container) return key as VariantProp
  else return 'default'
}

type VariantProp = 'default' | 'user' | 'assistant'

type Props = {
  content: string
  variant: VariantProp | (string & {})
  loading?: boolean
}

export const MessageBubble = forwardRef<HTMLDivElement, Props>(function MessageBubble(
  { content, variant, loading },
  ref,
) {
  const key = getVariantKey(variant)
  return (
    <div ref={ref} className={cn('grid grid-cols-[1rem_auto_1rem]', variants.container(key))}>
      <div
        className={cn(
          'prose prose-stone col-start-2 overflow-hidden rounded-lg px-3 py-2 text-sm dark:prose-invert',
          variants.content(key),
          loading && '[&>_:last-child:not(pre)]:after:inline-loading-ball',
        )}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
})
