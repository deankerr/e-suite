'use client'

import { useQuery } from 'convex/react'
import { useSelectedLayoutSegment } from 'next/navigation'

import { TopBar } from '@/components/ui/TopBar'
import { api } from '@/convex/_generated/api'
import { GenerateSidebar } from './GenerateSidebar'

import type { Id } from '@/convex/_generated/dataModel'

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  const slug = useSelectedLayoutSegment() as Id<'generations'> | null

  const generationsList = useQuery(api.generations.do.list, {})
  const generation = generationsList?.find((g) => g._id === slug)

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <TopBar />
      <div className="flex grow overflow-hidden">
        {children}
        <GenerateSidebar generation={generation} />
      </div>
    </div>
  )
}
