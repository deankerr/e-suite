import { Markdown } from '@/components/util/markdown'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const messageBubbleVariants = cva(
  'prose prose-stone rounded-lg px-3 py-2 dark:prose-invert w-fit col-span-9',
  {
    variants: {
      variant: {
        default:
          'bg-secondary text-center text-secondary-foreground col-start-2 col-end-12 justify-self-center',
        local: 'bg-primary text-primary-foreground justify-self-end col-end-12',
        remote: 'bg-muted text-secondary-foreground col-start-2 justify-self-start',
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
