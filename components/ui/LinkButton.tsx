import { Button, ButtonProps, IconButton } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'
import { ExternalLinkIcon, SquareArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export const LinkButton = ({
  color,
  variant,
  className,
  children,
  ...props
}: {
  color?: (typeof accentColors)[number]
  variant?: ButtonProps['variant']
} & React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className={cn('shrink-0', className)}>
      <Button variant={variant ?? 'soft'} color={color} size="1">
        {children} <SquareArrowUpRightIcon className="size-4" />
      </Button>
    </Link>
  )
}

export const LinkIconButton = ({
  color,
  className,
  children,
  ...props
}: { color?: (typeof accentColors)[number] } & React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className={cn('flex shrink-0', className)}>
      <IconButton variant="soft" color={color} size="1">
        {children} <ExternalLinkIcon className="size-4" />
      </IconButton>
    </Link>
  )
}
