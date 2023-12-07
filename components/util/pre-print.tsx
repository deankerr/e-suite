import { cn } from '@/lib/utils'

export function PrePrint({
  title,
  children,
  className,
}: { title?: string; children: React.ReactNode } & React.ComponentProps<'div'>) {
  return (
    <>
      <div
        className={cn('max-w-xl rounded-xl border bg-card text-card-foreground shadow', className)}
      >
        {title && <h3 className="mb-2 p-6 font-semibold leading-none tracking-tight">{title}</h3>}
        <pre className={cn('overflow-x-auto p-6 text-xs', title && 'pt-0')}>
          {JSON.stringify(children, null, 2)}
        </pre>
      </div>
    </>
  )
}
