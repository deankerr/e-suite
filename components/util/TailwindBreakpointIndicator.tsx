import { cn } from '@/lib/utils'

export function TailwindBreakpointIndicator() {
  if (process.env.NODE_ENV !== 'development') return null

  const content =
    "after:content-['xs'] sm:after:content-['sm'] md:after:content-['md'] lg:after:content-['lg'] xl:after:content-['xl'] 2xl:after:content-['2xl']"

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-50 flex h-6 w-5 place-items-center text-xs text-gray',
        content,
      )}
    ></div>
  )
}
