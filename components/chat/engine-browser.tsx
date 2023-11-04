import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getEngines } from './actions'
import { EngineTable } from './engine-table'
import { columns } from './engines/columns'
import { EnginesDataTable } from './engines/data-table'

export function EngineBrowser({ current }: { current: Engine }) {
  const [enginesData, setEnginesData] = useState<Engine[]>()

  if (!enginesData) {
    getEngines().then((res) => setEnginesData(res))
  }

  return (
    <>
      <Input placeholder="search for a model" />
      <p className="my-4 italic text-muted-foreground">Search info/feedback</p>
      <EnginesDataTable columns={columns} data={enginesData ?? []} />
    </>
  )
}
