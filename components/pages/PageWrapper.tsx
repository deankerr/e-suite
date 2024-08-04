import LoadingPage from '@/app/loading'
import { EmptyPage } from '@/components/shell/pages/EmptyPage'
import { cn } from '@/lib/utils'

export const PageWrapper = ({
  loading = false,
  empty = false,
  children,
  className,
  ...props
}: { loading?: boolean; empty?: boolean } & React.ComponentProps<'div'>) => {
  if (loading) return <LoadingPage />
  if (empty) return <EmptyPage />

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
