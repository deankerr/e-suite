import { cn } from '@/lib/utils'

export function PrePrint({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
} & React.ComponentProps<'div'>) {
  return (
    <>
      <div
        className={cn('max-w-xl rounded-xl border bg-card text-card-foreground shadow', className)}
      >
        {title && (
          <h3 className="mb-2 p-6 pb-0 font-semibold leading-none tracking-tight">{title}</h3>
        )}
        {description && <p className="px-6 pb-4 text-sm font-light">{description}</p>}
        <pre className={cn('overflow-x-auto p-6 text-xs', title && 'pt-0')}>
          {JSON.stringify(children, null, 2)}
        </pre>
      </div>
    </>
  )
}
