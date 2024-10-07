import { useCallback, useEffect, useRef, useState } from 'react'
import { LogLevel, Virtuoso, VirtuosoHandle } from 'react-virtuoso'

type Item = {
  _id: string
  [key: string]: any
}

type VirtualizedFeedProps<T extends Item> = {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  initialTopMostItemIndex?: number
  onAtTop?: () => void
  onAtBottom?: () => void
  reachThreshold?: number
}

export function VirtualizedFeed<T extends Item>({
  items,
  renderItem,
  initialTopMostItemIndex,
  onAtTop,
  onAtBottom,
  reachThreshold = 200,
}: VirtualizedFeedProps<T>) {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [itemsState, setItemsState] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const updateItems = useCallback((newItems: T[]) => {
    if (newItems.length === 0) return

    setItemsState((prevItems) => {
      const newItemsMap = new Map(newItems.map((item) => [item._id, item]))
      const oldItemsMap = new Map(prevItems.map((item) => [item._id, item]))

      const updatedItems: T[] = []

      // Check for prepended items
      let prependedCount = 0
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i]
        if (item && oldItemsMap.has(item._id)) break
        if (item) {
          updatedItems.push(item)
          prependedCount++
        }
      }

      // Add existing and new appended items
      prevItems.forEach((item) => {
        const newItem = newItemsMap.get(item._id)
        if (newItem) {
          updatedItems.push(newItem)
        }
      })

      newItems.slice(updatedItems.length).forEach((item) => {
        if (item) updatedItems.push(item)
      })

      setTotalCount((prevCount) => prevCount + prependedCount)

      // Scroll to maintain position when items are prepended
      if (prependedCount > 0 && virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({
          index: prependedCount,
          align: 'start',
          behavior: 'auto',
        })
      }

      return updatedItems
    })
  }, [])

  useEffect(() => {
    updateItems(items)
  }, [items, updateItems])

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop && onAtTop) {
        onAtTop()
      }
    },
    [onAtTop],
  )

  const handleAtBottomStateChange = useCallback(
    (atBottom: boolean) => {
      if (atBottom && onAtBottom) {
        onAtBottom()
      }
    },
    [onAtBottom],
  )

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={itemsState}
      totalCount={totalCount}
      initialTopMostItemIndex={initialTopMostItemIndex ?? totalCount - 1}
      alignToBottom
      itemContent={(index, item) => renderItem(item, index)}
      computeItemKey={(_, item) => item._id}
      atTopStateChange={handleAtTopStateChange}
      atBottomStateChange={handleAtBottomStateChange}
      atTopThreshold={reachThreshold}
      atBottomThreshold={reachThreshold}
      // overscan={5}
      increaseViewportBy={1000}
      logLevel={LogLevel.DEBUG}
    />
  )
}
