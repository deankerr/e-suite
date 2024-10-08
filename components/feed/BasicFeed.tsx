import { Fragment, useEffect, useRef, useState } from 'react'

import { ScrollAreaVertical } from '../ui/VScrollArea'

type Item = {
  _id: string
  [key: string]: any
}

type BasicFeedProps<T extends Item> = {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
}

export const BasicFeed = <T extends Item>({ items, renderItem }: BasicFeedProps<T>) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [itemsState, setItemsState] = useState(items.map((item, index) => renderItem(item, index)))

  // useEffect(() => {
  //   if (scrollAreaRef.current) {
  //     scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' })
  //   }
  // }, [items])

  return (
    <div className="h-full grow overflow-y-auto" ref={scrollAreaRef}>
      {/* {itemsState.map((item, index) => (
        <Fragment key={item._id}>{renderItem(item, index)}</Fragment>
      ))} */}
      {...itemsState}
    </div>
  )
}
