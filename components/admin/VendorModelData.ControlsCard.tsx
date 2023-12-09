'use client'

import { cn } from '@/lib/utils'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'

type VendorModelListsCardControlsProps = {
  actionControls: { label: string; action: () => Promise<any> }[]
} & React.ComponentProps<'div'>

export function VendorModelDataControlsCard({
  className,
  actionControls,
}: VendorModelListsCardControlsProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className={cn('space-x-4 px-2', className)}>
      {actionControls.map((control) => (
        <Button
          key={control.label}
          variant="outline"
          onClick={() =>
            startTransition(async () => {
              await control.action()
            })
          }
        >
          {isPending ? <Loading size="sm" /> : control.label}
        </Button>
      ))}
    </div>
  )
  // return (
  //   <div className={cn('space-x-4 px-2', className)}>
  //     <Button
  //       variant="outline"
  //       onClick={() =>
  //         startTransition(async () => {
  //           await fetchRemoteAction()
  //         })
  //       }
  //     >
  //       {isPending ? <Loading size="sm" /> : 'Fetch Remote'}
  //     </Button>

  //     <Button
  //       variant="outline"
  //       onClick={() =>
  //         startTransition2(async () => {
  //           await buildResourcesAction()
  //         })
  //       }
  //     >
  //       {isPending2 ? <Loading size="sm" /> : 'Build Resources'}
  //     </Button>

  //     <Button
  //       variant="outline"
  //       onClick={() =>
  //         startTransition3(async () => {
  //           await buildModels()
  //         })
  //       }
  //     >
  //       {isPending3 ? <Loading size="sm" /> : 'Build Models'}
  //     </Button>
  //   </div>
  // )
}
