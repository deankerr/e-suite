import LoadingPage from '@/app/loading'
import { cn } from '@/lib/utils'

export const PageWrapper = ({
  loading = false,
  children,
  className,
  ...props
}: { loading?: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'h-full w-full overflow-x-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border',
        className,
      )}
    >
      {loading ? <LoadingPage /> : children}
    </div>
  )
}
