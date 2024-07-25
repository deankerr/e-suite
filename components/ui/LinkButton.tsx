import { Button, ButtonProps, IconButton } from '@radix-ui/themes'
import { accentColors } from '@radix-ui/themes/props'
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
        {children}
      </Button>
    </Link>
  )
}

export const LinkButton2 = ({
  children,
  buttonProps,
  ...props
}: {
  buttonProps: ButtonProps
} & React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props}>
      <Button {...buttonProps}>{children}</Button>
    </Link>
  )
}

export const LinkIconButton = ({
  color,
  className,
  children,
  buttonProps,
  ...props
}: { buttonProps: ButtonProps } & React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className={cn('flex shrink-0', className)}>
      <IconButton {...buttonProps}>{children}</IconButton>
    </Link>
  )
}
