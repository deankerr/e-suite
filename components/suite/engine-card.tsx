import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'

export function EngineCard({
  engine,
  className,
  children,
}: { engine: Engine } & React.ComponentProps<'div'>) {
  const data = [
    ['creator', engine.creatorName],
    ['category', engine.type],
    ['context length', engine.contextLength],
    ['license', engine.license || '[unknown]'],
    ['price (input)', formatPrice(engine.providerId, engine.priceInput)],
    ['price (output)', formatPrice(engine.providerId, engine.priceOutput)],
  ] // availability, sources, datasheet, moderation

  return (
    <div
      className={cn(
        'grid w-full max-w-xl grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] items-center gap-2 border p-6',
        className,
      )}
    >
      <div className="col-span-2">
        <h2 className="text-lg font-semibold leading-none">{engine.displayName}</h2>
      </div>
      <div>
        <span className="text-muted-foreground">via </span>
        <span className="">{engine.providerId}</span>
      </div>
      {data.map((d) => (
        <div key={d[0]} className="h-full">
          <span className="text-sm text-muted-foreground ">{d[0]}</span>
          <div className="font-mono">{d[1]}</div>
        </div>
      ))}
    </div>
  )
}

//* temp, move to api parsing
function formatPrice(providerId: string, n: string) {
  if (providerId === 'openrouter') {
    return `$${Number(n) * 1000}`
  }

  return n
}
