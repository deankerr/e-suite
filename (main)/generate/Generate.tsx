'use client'

import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'

import { GenerationShell } from '@/components/generations/GenerationShell'
import { LoaderBars } from '@/components/ui/LoaderBars'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'

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
      <ScrollArea className="grow" scrollbars="vertical">
        {generation && <GenerationShell generation={generation} />}
        {generationId && !generation && <LoaderBars className="w-1/2" />}
      </ScrollArea>
    </div>
  )
}
