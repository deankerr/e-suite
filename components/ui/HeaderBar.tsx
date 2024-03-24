'use client'

import { cn } from '@/lib/utils'
import { SnailIcon, SquirrelIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'

type HeaderBarProps = {
  title?: React.ReactNode
} & React.ComponentProps<'div'>

// "flex-between z-40 h-[--e-header-h] shrink-0 border-b border-gold-5 bg-gray-1 sm:px-4"
// "flex-between h-14 shrink-0 border-b border-gold-5 bg-gray-1 px-3 sm:gap-2"

export const HeaderBar = forwardRef<HTMLDivElement, HeaderBarProps>(function HeaderBar(
  { title, className, ...props },
  forwardedRef,
) {
  const headerTitle = useAppStore((state) => state.headerTitle)
  return (
    <div
      {...props}
      className={cn('flex-between h-[--e-header-h] shrink-0 border-b bg-gray-2 sm:px-4', className)}
      ref={forwardedRef}
    >
      {/* start */}
      <div className="bg-red-4">
        <SquirrelIcon />
      </div>

      {/* start/middle */}
      <div className="flex-center grow bg-yellow-4">do {title ?? headerTitle ?? 'No Title'}</div>

      {/* end */}
      <div className="bg-green-4">
        <SnailIcon />
      </div>
    </div>
  )
})
