import { IconButton } from '@radix-ui/themes'
import { DotIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type HeaderBarProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const HeaderBar = ({ className, children, ...props }: HeaderBarProps) => {
  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <IconButton variant="ghost" color="gray" className="pointer-events-none shrink-0">
        <DotIcon />
      </IconButton>

      <div>{children}</div>

      <IconButton
        variant="ghost"
        color="gray"
        className="shrink-0"
        // onClick={() => stack.remove(thread?.slug)}
      >
        <XIcon />
      </IconButton>
    </div>
  )
}
