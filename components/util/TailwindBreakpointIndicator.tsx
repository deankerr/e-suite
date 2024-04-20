'use client'

import { useWindowSize } from '@uidotdev/usehooks'

import { cn } from '@/lib/utils'

export function TailwindBreakpointIndicator() {
  const size = useWindowSize()
  const content =
    "before:content-['xs'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl'] 2xl:before:content-['2xl']"
  if (process.env.NODE_ENV !== 'development') return null
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[99999] bg-[#111111] text-[0.5rem] text-[#BBBBBB]',
        content,
      )}
    >
      <span className="">
        ⋅{size.width}x{size.height}
      </span>
    </div>
  )
}
