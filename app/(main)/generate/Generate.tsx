'use client'

import { GenerationShell } from '@/components/generations/GenerationShell'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'

type GenerateProps = {
  generationId?: Id<'generations'>
} & React.ComponentProps<'div'>

export const Generate = ({ generationId, className, ...props }: GenerateProps) => {
  const generationsList = useQuery(api.generations.do.list, {})
  const generation = generationsList?.find((g) => g._id === generationId)

  return (
    <div
      {...props}
      className={cn('flex grow flex-col overflow-y-auto overflow-x-hidden', className)}
    >
      {/* main */}
      <div className="flex h-full">
        {/* content */}
        <div className={cn('flex-col-center grow')}>
          {generation && <GenerationShell generation={generation} />}
          {generationId && !generation && <LoaderBars className="w-1/2" />}
        </div>
      </div>
    </div>
  )
}
