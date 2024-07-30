import { cn } from '@/lib/utils'

type PreProps = { stringify?: unknown } & React.ComponentProps<'pre'>

export const Pre = ({ stringify, className, children, ...props }: PreProps) => {
  return (
    <pre
      {...props}
      className={cn('overflow-auto rounded-md bg-blackA-12 p-3 font-mono text-xs', className)}
    >
      {stringify ? JSON.stringify(stringify, null, 2) : children}
    </pre>
  )
}
