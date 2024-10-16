'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { usePatterns } from '@/app/lib/api/patterns'
import { cn } from '@/app/lib/utils'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { Button } from '../ui/Button'

export const PatternsNavPanel = () => {
  const patterns = usePatterns()
  const params = useParams()
  const currentXid = params.id?.[0]

  if (!patterns) return null
  return (
    <NavPanel className={cn(params.id && 'hidden sm:flex')}>
      <PanelHeader>
        <NavigationButton />

        <PanelTitle href="/patterns">Patterns</PanelTitle>

        <div className="grow" />

        <Link href="/patterns">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {patterns?.map((pattern) => (
            <Link
              key={pattern._id}
              href={`/patterns/${pattern.xid}`}
              className={cn(
                'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
                currentXid === pattern.xid && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {pattern.name ?? `Untitled (${pattern.xid})`}
            </Link>
          ))}
        </div>
      </VScrollArea>
    </NavPanel>
  )
}
