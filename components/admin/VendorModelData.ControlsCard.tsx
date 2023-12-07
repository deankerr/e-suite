'use client'

import { cn } from '@/lib/utils'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'

type VendorModelListsCardControlsProps = {
  action: () => Promise<void>
} & React.ComponentProps<'div'>

export function VendorModelDataControlsCard({
  className,
  /* @ts-ignore this is allowed for server actions */
  action,
}: VendorModelListsCardControlsProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className={cn('px-2', className)}>
      <Button
        onClick={() =>
          startTransition(async () => {
            await action()
          })
        }
      >
        {isPending ? <Loading size="sm" /> : 'Fetch Remote'}
      </Button>
    </div>
  )
}
