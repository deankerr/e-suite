import { cn } from '@/lib/utils'

const links = {
  home: '/',
  threads: '/threads',
  thread: '/thread',
}

type DevNavProps = {
  side?: keyof typeof sides
}

export const DevNav = ({ side = 'bl' }: DevNavProps) => {
  const devlinks = new Map(Object.entries(links))
  return (
    <div className={cn('fixed flex flex-col bg-accent-1 p-0.5 text-xs', sides[side])}>
      {[...devlinks].map(([key, value]) => (
        <a key={key} href={value}>
          {key}
        </a>
      ))}
    </div>
  )
}

const sides = {
  tl: 'top-1 left-1',
  tr: 'top-1 right-1',
  bl: 'bottom-12 left-1',
  br: 'bottom-12 right-1',
} as const
