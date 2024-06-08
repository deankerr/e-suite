import { cn } from '@/lib/utils'

type PreProps = { json?: string } & React.ComponentProps<'pre'>

export const Pre = ({ json, className, children, ...props }: PreProps) => {
  return (
    <pre
      {...props}
      className={cn('h-full overflow-auto rounded-md bg-surface p-3 font-mono text-xs', className)}
    >
      {json ? JSON.stringify(JSON.parse(json), null, 2) : children}
    </pre>
  )
}
