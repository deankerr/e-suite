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
    ['price (input)', nanoUSDToDollars(Number(engine.costInputNanoUSD)).toString()],
    ['price (output)', nanoUSDToDollars(Number(engine.costOutputNanoUSD)).toString()],
  ] // availability, sources, datasheet, moderation

  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] items-center gap-2 rounded-md border-2 p-6',
        className,
      )}
    >
      <div className="col-span-2">
        <h2 className="text-md font-semibold leading-none">{engine.displayName}</h2>
      </div>
      {data.map((d) => (
        <div key={d[0]} className="h-full">
          <span className="text-xs text-muted-foreground ">{d[0]}</span>
          <div className="font-mono text-sm">{d[1]}</div>
        </div>
      ))}
    </div>
  )
}
