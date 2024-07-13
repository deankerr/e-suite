import { Tooltip } from '@radix-ui/themes'
import { format, formatDistanceToNowStrict, isThisYear } from 'date-fns'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export const TimeSinceLink = ({
  time,
  className,
  ...props
}: { time: number } & React.ComponentProps<typeof Link>) => {
  return (
    <Tooltip content={format(time, 'MMM d, yyyy h:mm a')}>
      <Link {...props} className={cn('meticulous-ignore text-gray-10 hover:underline', className)}>
        {formatTimeToDisplayShort(time)}
      </Link>
    </Tooltip>
  )
}

export function formatTimeToDisplayShort(time: number) {
  const date = new Date(time)

  if (isThisYear(date)) {
    return formatDistanceToNowStrict(date, { addSuffix: false })
      .replace(/ seconds?/, 's')
      .replace(/ minutes?/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd')
      .replace(/ months?/, 'mo')
      .replace(/ years?/, 'y')
  }

  return format(date, 'MMM d, yyyy')
}
