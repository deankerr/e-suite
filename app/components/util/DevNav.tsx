import { cn } from '@/lib/utils'

const links = {
  home: '/',
  threads: '/threads',
  thread: '/thread',
}

type DevNavProps = React.ComponentProps<'div'>

export const DevNav = ({ className, ...props }: DevNavProps) => {
  const devlinks = new Map(Object.entries(links))
  return (
    <div {...props} className={cn('flex flex-col bg-accent-1 p-0.5 text-xs', className)}>
      {[...devlinks].map(([key, value]) => (
        <a key={key} href={value}>
          {key}
        </a>
      ))}
    </div>
  )
}
