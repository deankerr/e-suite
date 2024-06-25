import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'

export const ScrollContainer = ({
  className,
  children,
  threshold = 180,
}: {
  className?: ClassNameValue
  children: React.ReactNode
  threshold?: number
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const bottomPosition = scrollHeight - scrollTop - clientHeight
      setShowScrollButton(bottomPosition > threshold)
    }
  }

  const scrollToEnd = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const bottomPosition = scrollHeight - scrollTop - clientHeight
    if (bottomPosition < threshold) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [children, threshold])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        ref={containerRef}
        className={cn('flex-1 overflow-y-auto scroll-smooth', className)}
        onScroll={handleScroll}
      >
        {children}
      </div>
      {showScrollButton && (
        <IconButton variant="soft" className="absolute bottom-3 right-7" onClick={scrollToEnd}>
          <ArrowDown />
        </IconButton>
      )}
    </div>
  )
}
