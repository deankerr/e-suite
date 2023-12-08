'use client'

import { cn } from '@/lib/utils'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'

type VendorModelListsCardControlsProps = {
  fetchRemoteAction: () => Promise<void>
  buildResourcesAction: () => Promise<void>
} & React.ComponentProps<'div'>

export function VendorModelDataControlsCard({
  className,
  /* @ts-ignore this is allowed for server actions */
  fetchRemoteAction,
  buildResourcesAction,
}: VendorModelListsCardControlsProps) {
  const [isPending, startTransition] = useTransition()
  const [isPending2, startTransition2] = useTransition()

  return (
    <div className={cn('space-x-4 px-2', className)}>
      <Button
        variant="outline"
        onClick={() =>
          startTransition(async () => {
            await fetchRemoteAction()
          })
        }
      >
        {isPending ? <Loading size="sm" /> : 'Fetch Remote'}
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          startTransition2(async () => {
            await buildResourcesAction()
          })
        }
      >
        {isPending2 ? <Loading size="sm" /> : 'Build Resources'}
      </Button>
    </div>
  )
}
