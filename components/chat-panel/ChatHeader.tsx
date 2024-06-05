import { IconButton } from '@radix-ui/themes'
import { FileQuestionIcon, ImagesIcon, MessagesSquareIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'
import type { LucideIcon } from 'lucide-react'

type ChatHeaderProps = {
  icon?: LucideIcon
  thread?: EThreadWithContent | null
  onClosePanel?: () => void
} & React.ComponentProps<'div'>

export const ChatHeader = ({
  icon,
  onClosePanel,
  thread,
  children,
  className,
  ...props
}: ChatHeaderProps) => {
  const textToImage = thread?.config.type === 'text-to-image' ? thread.config : null
  const IconComponent = icon ?? textToImage ? ImagesIcon : MessagesSquareIcon

  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      {/* panel icon */}
      <div className="w-14 shrink-0 flex-center">
        <Link href={thread ? `/thread/${thread.slug}` : '/t'}>
          {thread ? (
            <IconComponent className="text-accent-11" />
          ) : thread === null ? (
            <FileQuestionIcon className="text-red-11" />
          ) : (
            <LoadingSpinner />
          )}
        </Link>
      </div>

      {/* title */}
      <div className="flex grow truncate">{children}</div>

      {/* controls */}
      <div className="w-14 shrink-0 flex-end">
        {onClosePanel && (
          <IconButton variant="ghost" color="gray" className="m-0 shrink-0" onClick={onClosePanel}>
            <XIcon />
          </IconButton>
        )}
      </div>

      {/* debug ui */}
      <NonSecureAdminRoleOnly>
        <div className="absolute left-0 top-0 z-50 font-mono text-xs text-gold-4">
          {thread?.slug}
        </div>
      </NonSecureAdminRoleOnly>
    </div>
  )
}
