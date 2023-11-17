import { cn } from '@/lib/utils'
import { tabsEnum } from './suite-shell'

export function SubMenuTabBar({
  tab,
  setTab,
  className,
}: {
  tab: keyof typeof tabsEnum
  setTab: (v: keyof typeof tabsEnum) => void
} & React.ComponentProps<'div'>) {
  return (
    <div className={cn('', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          tab === 'buffer' && 'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        onClick={() => setTab('buffer')}
      >
        Buffer
      </div>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          tab === 'parameters' &&
            'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        onClick={() => setTab('parameters')}
      >
        Parameters
      </div>
      <div
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          tab === 'detail' && 'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        onClick={() => setTab('detail')}
      >
        Details
      </div>
    </div>
  )
}
