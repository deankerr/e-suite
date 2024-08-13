'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ScrollArea } from '@radix-ui/themes'

export const NavGroup = ({
  heading,
  hidden = false,
  children,
}: {
  heading?: string
  hidden?: boolean
  children?: React.ReactNode
}) => {
  const [containerRef] = useAutoAnimate()

  if (hidden) return null
  return (
    <div className="flex flex-col overflow-hidden">
      {heading && (
        <div className="shrink-0 border-b border-gray-5 px-3 text-sm font-semibold text-gray-11">
          {heading}
        </div>
      )}

      <ScrollArea scrollbars="vertical" className="grow">
        <div ref={containerRef} className="h-full space-y-1 px-1 py-1">
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}
