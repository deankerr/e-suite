'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ScrollArea } from '@radix-ui/themes'

export const NavGroup = ({
  heading,
  hidden = false,
  scrollable = false,
  children,
}: {
  heading?: string
  hidden?: boolean
  scrollable?: boolean
  children?: React.ReactNode
}) => {
  const [containerRef] = useAutoAnimate()

  if (hidden) return null
  return (
    <>
      {heading && (
        <div className="shrink-0 border-b border-gray-5 px-3 text-sm font-semibold text-gray-11">
          {heading}
        </div>
      )}

      {scrollable ? (
        <ScrollArea scrollbars="vertical">
          <div ref={containerRef} className="h-full space-y-1 px-1 py-1">
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div ref={containerRef} className="space-y-1 px-1 py-1">
          {children}
        </div>
      )}
    </>
  )
}
