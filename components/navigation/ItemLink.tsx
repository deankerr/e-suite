import { forwardRef } from 'react'
import NextLink from 'next/link'

import { cn } from '@/lib/utils'

type ItemLinkProps = {
  href: string
  icon: React.ReactNode
  title: string
  isActive?: boolean
} & Partial<React.ComponentProps<typeof NextLink>>

export const ItemLink = forwardRef<HTMLAnchorElement, ItemLinkProps>(function ItemLink(
  { href, icon, title, isActive = false, className, ...props },
  forwardedRef,
) {
  return (
    <NextLink
      {...props}
      href={href}
      className={cn(
        'flex-between gap-2.5 rounded border border-transparent px-1 py-4 text-gray-11 transition-colors',
        isActive ? 'bg-gray-3 text-gray-12' : 'hover:bg-gray-2 hover:text-gray-12',
        className,
      )}
      ref={forwardedRef}
    >
      <div className={cn('flex-center w-6 shrink-0 text-gray-10', isActive && 'text-gray-11')}>
        {icon}
      </div>
      <div className="grow truncate text-sm font-medium">{title}</div>
    </NextLink>
  )
})
