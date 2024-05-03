import { useMeasure } from '@uidotdev/usehooks'
import { chunk } from 'remeda'

export const JustifiedRowGrid = <Item extends { width: number; height: number }>({
  items = [],
  render,
  gap = 0,
  itemsPerRow: staticRowSize,
  breakpoints = [520, 768, 1024, 1280, 1700],
}: {
  items?: Item[]
  render: (item: Item, commonHeight?: number) => React.ReactNode
  itemsPerRow?: number
  gap?: number
  breakpoints?: number[]
}) => {
  const [widthRef, size] = useMeasure()

  if (!items.length) return null

  const rowWidth = size.width ?? 520
  const breakpointRowSize =
    breakpoints.findIndex((width) => rowWidth < width) + 1 || breakpoints.length

  const rowSize = Math.max(1, staticRowSize || breakpointRowSize)
  const itemRows = chunk(items, rowSize)
  return (
    <div className="grid" style={{ gap }}>
      <div ref={widthRef} className="absolute w-full">
        {/* measure */}
      </div>

      {itemRows.map((row, i) => {
        if (rowSize <= 1) return row.map((item) => render(item))
        // sum aspect ratios of each row item
        const totalAspectRatio = row.reduce(
          (acc, curr) => acc + curr.width / curr.height,
          rowSize - row.length, // init. value - remainder row roughly increased
        )
        const commonHeight = rowWidth / totalAspectRatio
        return (
          <div key={i} className="flex" style={{ gap }}>
            {row.map((item) => render(item, commonHeight))}
          </div>
        )
      })}
    </div>
  )
}
