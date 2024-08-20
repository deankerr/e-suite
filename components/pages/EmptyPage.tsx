import * as Icons from '@phosphor-icons/react/dist/ssr'

import { Link } from '@/components/ui/Link'
import { cn } from '@/lib/utils'

export const EmptyPage = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex-col-center h-full w-full', className)}>
      <Icons.Cat weight="thin" className="size-64 shrink-0 text-accentA-11 opacity-60" />

      <div className="my-8 font-mono text-xl">
        There doesn&apos;t appear to be anything at this address.
      </div>

      <Link href="/">Home</Link>
    </div>
  )
}
