import { Tooltip } from '@radix-ui/themes'
import { format } from 'date-fns'
import Link from 'next/link'

import { cn, formatTimeToDisplayShort } from '@/lib/utils'

export const TimeSinceLink = ({
  time,
  className,
  ...props
}: { time: number } & React.ComponentProps<typeof Link>) => {
  return (
    <Tooltip content={format(time, 'MMM d, yyyy h:mm a')}>
      <Link {...props} className={cn('', className)}>
        {formatTimeToDisplayShort(time)}
      </Link>
    </Tooltip>
  )
}
