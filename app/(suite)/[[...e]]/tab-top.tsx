'use client'

import { cn } from '@/lib/utils'
import { DotFilledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function TabTop({ title }: { title: string }) {
  const pathname = usePathname()
  const isActive = decodeURI(pathname) === '/' + title

  return (
    <Link
      href={`/${title}`}
      className={cn(
        'flex h-full min-w-[9rem] items-center justify-between border-r border-r-border border-t-primary px-3 text-sm font-medium',
        isActive && 'border-t-2 bg-background',
      )}
    >
      <div className="px-1"></div>
      {title}
      <DotFilledIcon />
    </Link>
  )
}
