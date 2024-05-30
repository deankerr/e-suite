import { IconButton } from '@radix-ui/themes'
import { ImageIcon, MessagesSquareIcon, XIcon } from 'lucide-react'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type HeaderBarProps = {
  thread: EThreadWithContent
  handleCloseThread: () => void
} & React.ComponentProps<'div'>

export const HeaderBar = ({
  handleCloseThread,
  thread,
  className,
  children,
  ...props
}: HeaderBarProps) => {
  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <div className="w-14 shrink-0 gap-2 flex-center">
        {thread.active.type.includes('image') ? (
          <ImageIcon className="size-6" />
        ) : (
          <MessagesSquareIcon className="size-6" />
        )}
      </div>

      <div className="flex max-w-80 grow">{children}</div>

      <div className="w-14 shrink-0 flex-end">
        <IconButton
          variant="ghost"
          color="gray"
          className="m-0 shrink-0"
          onClick={handleCloseThread}
        >
          <XIcon />
        </IconButton>
      </div>

      <NonSecureAdminRoleOnly>
        <div className="absolute left-0 top-0 font-mono text-xs text-gold-4">{thread.slug}</div>
      </NonSecureAdminRoleOnly>
    </div>
  )
}
