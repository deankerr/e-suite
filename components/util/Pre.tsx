import { cn } from '@/lib/utils'

type PreProps = { json?: string } & React.ComponentProps<'pre'>

export const Pre = ({ json, className, children, ...props }: PreProps) => {
  return (
    <pre
      {...props}
      className={cn('overflow-auto rounded-md bg-blackA-12 p-3 font-mono text-xs', className)}
    >
      {json ? JSON.stringify(JSON.parse(json), null, 2) : children}
    </pre>
  )
}
