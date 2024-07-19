import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const PageWrapper = ({
  loading = false,
  children,
  className,
  ...props
}: { loading?: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div className="h-full w-full md:ml-56 md:p-2">
      <div
        {...props}
        className={cn('h-full w-full border-grayA-3 bg-gray-2 md:rounded-md md:border', className)}
      >
        {loading ? (
          <div className="flex h-full w-full">
            <Logo className="m-auto size-48 animate-pulse brightness-[.25] saturate-0" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
