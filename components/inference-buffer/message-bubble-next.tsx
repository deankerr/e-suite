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
    default: 'bg-secondary text-center text-secondary-foreground mx-auto ',
    user: 'bg-primary text-primary-foreground ml-auto',
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
  avatar?: string
}

export const MessageBubbleNext = forwardRef<HTMLDivElement, Props>(function MessageBubble(
  { content, variant, loading, avatar },
  ref,
) {
  const key = getVariantKey(variant)
  const debug = false

  const avatarIcon = (
    <Avatar className="rounded-lg">
      {avatar && <AvatarImage src={avatar} />}
      {avatar && <AvatarFallback className="rounded-lg">User</AvatarFallback>}
    </Avatar>
  )

  // grid-cols-[minmax(1rem,auto)_1fr_minmax(1rem,auto)] user/ai
  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-[minmax(1rem,auto)_1fr_minmax(1rem,auto)] grid-rows-[0.5rem_auto_0.5rem] place-content-center justify-center',
      )}
    >
      <div className="bg-rose-300 bg-opacity-0"></div>
      <div className="bg-rose-400 bg-opacity-0"></div>
      <div className="bg-rose-500 bg-opacity-0"></div>

      <div className="bg-green-30 bg-opacity-0 pr-4 pt-0.5">
        {variant === 'assistant' && avatarIcon}
      </div>

      <div
        className={cn(
          'prose prose-stone w-fit overflow-hidden rounded-lg bg-muted p-4 text-sm dark:prose-invert',
          variants.content(key),
          loading && '[&>_:last-child:not(pre)]:after:inline-loading-ball',
        )}
      >
        <Markdown>{content}</Markdown>
      </div>

      <div className="bg-green-50 bg-opacity-0 pl-4 pt-0.5">{variant === 'user' && avatarIcon}</div>

      <div className="bg-blue-300 bg-opacity-0"></div>
      <div className="bg-blue-400 bg-opacity-0"></div>
      <div className="bg-blue-500 bg-opacity-0"></div>
    </div>
  )
})
