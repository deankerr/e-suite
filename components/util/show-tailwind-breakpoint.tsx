import { cn } from '@/lib/utils'

export function ShowTailwindBreakpoint() {
  const content =
    "after:content-['xs'] sm:after:content-['sm'] md:after:content-['md'] xl:after:content-['xl'] 2xl:after:content-['2xl']"
  return (
    <div
      className={cn('fixed right-0 z-50 flex h-6 w-5 place-items-center text-xs', content)}
    ></div>
  )
}
