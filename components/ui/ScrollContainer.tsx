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
  const prevScrollHeightRef = useRef<number>(0)

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [scrollDebug, setScrollDebug] = useState('')

  // const handleScroll = () => {
  //   if (containerRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current
  //     const bottomPosition = scrollHeight - scrollTop - clientHeight
  //     setShowScrollButton(bottomPosition > threshold)

  //     setScrollDebug(`${scrollTop} ${scrollHeight}`)
  //   }
  // }

  // const scrollToEnd = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight
  //   }
  // }

  // useEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight
  //   }
  // }, [])
  useEffect(() => {
    console.log('up')
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
      console.log(scrollBottom)
      container.scrollTop =
        container.scrollHeight - prevScrollHeightRef.current + container.scrollTop
      prevScrollHeightRef.current = container.scrollHeight

      if (scrollBottom <= 1) {
        container.scrollTop = container.scrollHeight
      }
    })

    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div
        ref={containerRef}
        className={cn('flex-1 overflow-y-auto', className)}
        // onScroll={handleScroll}
      >
        {children}
      </div>
      <div className="fixed right-2 top-2 bg-lime-3 font-mono">{scrollDebug}</div>
      {/* {showScrollButton && (
        <IconButton variant="soft" className="absolute bottom-3 right-7">
          <ArrowDown />
        </IconButton>
      )} */}
    </div>
  )
}
