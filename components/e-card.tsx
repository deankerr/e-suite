import { cn } from '@/lib/utils'

export function ECard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      {title && <h3 className="mb-2 p-6 font-semibold leading-none tracking-tight">{title}</h3>}
      <div className={cn('p-6', title && 'pt-0')}>{children}</div>
    </div>
  )
}
