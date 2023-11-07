import { cn } from '@/lib/utils'

export function PrePrint({ title, children }: { title?: string; children: unknown }) {
  return (
    <>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        {title && <h3 className="mb-2 p-6 font-semibold leading-none tracking-tight">{title}</h3>}
        <pre className={cn('overflow-x-auto p-6 text-xs', title && 'pt-0')}>
          {JSON.stringify(children, null, 2)}
        </pre>
      </div>
    </>
  )
}
