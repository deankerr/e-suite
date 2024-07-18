import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

export const RenderMate = ({ className }: { className?: string }) => {
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current++
  })
  return (
    <div
      key={renderCount.current}
      className={cn(
        'absolute -inset-4 isolate animate-fade rounded-full bg-amberA-11 animate-reverse animate-once',
        className,
      )}
    ></div>
  )
}
