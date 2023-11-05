'use client'

import { ChatTab } from '@/lib/db'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const subTabsList = [
  { title: 'Models', path: 'models' },
  { title: 'Parameters', path: 'parameters' },
  { title: 'Messages', path: 'messages' },
]

export function InnerTabBar({ chatTab }: { chatTab?: ChatTab }) {
  const segment = useSelectedLayoutSegment()

  if (!chatTab) return null
  console.log('inner tab seg', segment)
  const subTabs = chatTab.engineId ? subTabsList : [{ title: 'Models', path: '/models' }]

  return (
    <div className="w-full overflow-x-auto">
      {subTabs.map((t) => (
        <Link
          key={t.path}
          className={cn(
            'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
            t.path === segment &&
              'border-b-2 border-primary font-medium text-foreground opacity-100',
          )}
          href={t.path}
        >
          {t.title}
        </Link>
      ))}
    </div>
  )
}
