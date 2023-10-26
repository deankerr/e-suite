import { Markdown } from '@/components/util/markdown'
import { cn } from '@/lib/utils'

const messageBubbleVariants = {
  container: {
    default: 'grid-cols-[2rem_auto_2rem]',
    user: 'grid-cols-[minmax(2.5rem,1fr)_auto_1rem]',
    assistant: 'grid-cols-[1rem_auto_minmax(2.5rem,1fr)]',
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

export function MessageBubble({
  content,
  variant,
}: {
  content: string
  variant: VariantProp | (string & {})
}) {
  const key = getVariantKey(variant)
  return (
    <div className={cn('grid', variants.container(key))}>
      <div
        className={cn(
          'prose prose-stone col-start-2 overflow-hidden rounded-lg px-3 py-2 dark:prose-invert',
          variants.content(key),
        )}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}
