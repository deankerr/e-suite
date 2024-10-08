'use client'

import { useWindowSize } from '@react-hookz/web'

import { cn } from '@/app/lib/utils'
import { ClientOnly } from '@/components/util/ClientOnly'

export function TailwindBreakpointIndicator() {
  const { width, height } = useWindowSize()
  if (process.env.NODE_ENV !== 'development') return null
  const content =
    "before:content-['xs'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl'] 2xl:before:content-['2xl']"
  const dimensions = width && height ? `⋅${width}x${height}` : null

  return (
    <ClientOnly>
      <div
        suppressHydrationWarning
        className={cn(
          'fixed bottom-0 right-0 z-[99999] bg-[#111111] text-[0.5rem] text-[#BBBBBB] opacity-30',
          content,
        )}
      >
        <span>{dimensions}</span>
      </div>
    </ClientOnly>
  )
}
