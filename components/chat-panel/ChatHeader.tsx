import { IconButton } from '@radix-ui/themes'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type ChatHeaderProps = { onClosePanel: () => void } & React.ComponentProps<'div'>

export const ChatHeader = ({ onClosePanel, children, className, ...props }: ChatHeaderProps) => {
  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <div className="w-14 shrink-0 flex-center"></div>
      <div className="flex grow truncate">{children}</div>
      <div className="w-14 shrink-0 flex-end">
        <IconButton variant="ghost" color="gray" className="m-0 shrink-0" onClick={onClosePanel}>
          <XIcon />
        </IconButton>
      </div>
    </div>
  )
}
