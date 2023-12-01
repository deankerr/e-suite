import { cn, nanoUSDToDollars } from '@/lib/utils'
import { Engine } from '@/schema/dto'
import { Loading } from './ui/loading'

export function EngineDataGrid({
  engine,
  className,
}: { engine?: Engine } & React.ComponentProps<'div'>) {
  if (!engine) return <Loading />

  const data = [
    ['via', engine.vendor?.displayName],
    ['creator', engine.creatorName],
    ['category', engine.category],
    ['context length', engine.contextLength],
    ['license', engine.license || '[unknown]'],
    ['price (input)', '$' + nanoUSDToDollars(Number(engine.costInputNanoUsd)).toString()],
    ['price (output)', '$' + nanoUSDToDollars(Number(engine.costOutputNanoUsd)).toString()],
  ] // availability, sources, datasheet, moderation

  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,_minmax(8rem,_1fr))] items-center gap-2',
        className,
      )}
    >
      {data.map((d) => (
        <div key={d[0]} className="h-full">
          <span className="text-xs text-muted-foreground ">{d[0]}</span>
          <div className="font-mono text-sm">{d[1]}</div>
        </div>
      ))}
    </div>
  )
}
