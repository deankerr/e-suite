import { IconButton } from '@radix-ui/themes'
import { MessagesSquareIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { LucideIcon } from 'lucide-react'

type ChatHeaderProps = { icon?: LucideIcon; onClosePanel: () => void } & React.ComponentProps<'div'>

export const ChatHeader = ({
  icon,
  onClosePanel,
  children,
  className,
  ...props
}: ChatHeaderProps) => {
  const IconComponent = icon ?? MessagesSquareIcon

  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      {/* panel icon */}
      <div className="w-14 shrink-0 flex-center">
        <IconComponent className="flex-none text-accent-11" />
      </div>

      {/* title */}
      <div className="flex grow truncate">{children}</div>

      {/* controls */}
      <div className="w-14 shrink-0 flex-end">
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0" onClick={onClosePanel}>
          <XIcon />
        </IconButton>
      </div>
    </div>
  )
}
