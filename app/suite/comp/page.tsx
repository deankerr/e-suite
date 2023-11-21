'use client'

import { EngineCard } from '@/components/engine-card'
import { useEnginesQuery } from '@/components/suite/queries'

export default function CompPage() {
  const { data: engines = [] } = useEnginesQuery()

  return (
    <div className="flex h-full flex-wrap gap-8 overflow-y-auto p-4">
      {engines.map((engine) => (
        <EngineCard key={engine.id} engine={engine} />
      ))}
    </div>
  )
}
