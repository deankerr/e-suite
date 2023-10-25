import { Markdown } from '@/components/util/markdown'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const messageBubbleVariants = cva(
  'prose prose-stone rounded-lg px-3 py-2 dark:prose-invert w-fit',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-center text-secondary-foreground mx-auto',
        local: 'bg-primary text-primary-foreground ml-auto mr-3',
        remote: 'bg-muted text-secondary-foreground mr-auto ml-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export function MessageBubble({
  content,
  variant,
}: { content: string } & VariantProps<typeof messageBubbleVariants>) {
  return (
    <div className={cn(messageBubbleVariants({ variant }))}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
