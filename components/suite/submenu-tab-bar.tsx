'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { tabsEnum } from './_suite'

const root = 'ui'

export function SubMenuTabBar({ className }: {} & React.ComponentProps<'div'>) {
  const { id } = useParams()
  const readParam = (tab: string) => id && id[1] && id[1] === tab
  const getTabPath = (name: string) => {
    return `/${root}/${id![0]}/${name}`
  }
  // console.log('params', params)
  return (
    <div className={cn('', className)}>
      <Link
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          readParam('buffer') &&
            'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        href={getTabPath('buffer')}
        // onClick={() => setTab('buffer')}
      >
        Buffer
      </Link>
      <Link
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          readParam('parameters') &&
            'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        // onClick={() => setTab('parameters')}
        href={getTabPath('parameters')}
      >
        Parameters
      </Link>
      <Link
        className={cn(
          'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
          readParam('detail') &&
            'border-b-2 border-primary font-medium text-foreground opacity-100',
        )}
        // onClick={() => setTab('detail')}
        href={getTabPath('detail')}
      >
        Details
      </Link>
    </div>
  )
}
