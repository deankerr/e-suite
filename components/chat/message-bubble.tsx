import { Markdown } from '@/components/util/markdown'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const messageBubbleVariants = {
  container: {
    default: 'grid-cols-[2rem_auto_2rem]',
    user: 'grid-cols-[minmax(2.5rem,1fr)_auto] sm:pl-.5 sm:pr-1',
    assistant: 'grid-cols-[auto_minmax(2.5rem,1fr)]',
  },
  content: {
    default: 'bg-secondary text-center text-secondary-foreground',
    user: 'bg-primary text-primary-foreground',
    assistant: 'bg-muted text-secondary-foreground',
  },
} as const

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
    <div ref={ref} className={cn('grid place-content-center', variants.container(key))}>
      <div
        className={cn(
          'prose prose-stone col-start-2 overflow-hidden rounded-lg px-3 py-2 dark:prose-invert',
          variants.content(key),
          loading && '[&>_:last-child:not(pre)]:after:inline-loading-ball',
        )}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
})
