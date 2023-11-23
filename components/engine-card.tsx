import { Engine } from '@/lib/db'
import { cn, nanoUSDToDollars } from '@/lib/utils'

export function EngineCard({
  engine,
  className,
}: { engine: Engine } & React.ComponentProps<'div'>) {
  const data = [
    ['via', engine.provider?.displayName],
    ['creator', engine.creator],
    ['category', engine.type],
    ['context length', engine.contextLength],
    ['license', engine.license || '[unknown]'],
    ['price (input)', '$' + nanoUSDToDollars(Number(engine.costInputNanoUSD)).toString()],
    ['price (output)', '$' + nanoUSDToDollars(Number(engine.costOutputNanoUSD)).toString()],
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
