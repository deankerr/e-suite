import { useMeasure } from '@uidotdev/usehooks'
import { chunk } from 'remeda'

export const JustifiedRowGrid = <Item extends { width: number; height: number }>({
  items = [],
  render,
  itemsPerRow = 3,
  gap = 0,
}: {
  items?: Item[]
  render: (item: Item, commonHeight: number) => React.ReactNode
  itemsPerRow?: number
  gap?: number
}) => {
  const [widthRef, { width }] = useMeasure()

  if (!items.length) return null

  const rowWidth = width ?? 320
  const itemRows = chunk(items, itemsPerRow)

  return (
    <div ref={widthRef} className="grid" style={{ gap }}>
      {itemRows.map((row, i) => {
        // sum aspect ratios of each row item
        const totalAspectRatio = row.reduce(
          (acc, curr) => acc + curr.width / curr.height,
          itemsPerRow - row.length, // init. value - remainder row roughly increased
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
