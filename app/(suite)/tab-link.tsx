'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type Props = { activeClassName: string } & LinkProps & React.HTMLAttributes<HTMLAnchorElement>

export function TabLink({ className, activeClassName, ...props }: Props) {
  const segment = useSelectedLayoutSegment() ?? ''
  const isActive = props.href.toString().endsWith(`/${decodeURI(segment)}`)
  return <Link {...props} className={cn(className, isActive && activeClassName)} />
}
