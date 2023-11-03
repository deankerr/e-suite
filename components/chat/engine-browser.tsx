import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { EngineTable } from './engine-table'

export function EngineBrowser({ current }: { current: Engine }) {
  return (
    <>
      <Input placeholder="search for a model" />
      <p className="my-4 italic text-muted-foreground">Search info/feedback</p>
      <EngineTable engine={current} />
    </>
  )
}
