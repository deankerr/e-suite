import { Link as RxLink } from '@radix-ui/themes'
import NextLink, { LinkProps } from 'next/link'

export const Link = ({
  href,
  children,
  ...props
}: { href: LinkProps['href'] } & Omit<React.ComponentProps<typeof RxLink>, 'href'>) => {
  return (
    <RxLink {...props} asChild>
      <NextLink href={href}>{children}</NextLink>
    </RxLink>
  )
}
