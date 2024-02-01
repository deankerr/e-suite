'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useAtom } from 'jotai'
import { getUiAtom } from '../atoms'
import { GenerationForm } from '../section/GenerationForm'

type GenerationBarDraggableProps = {
  props?: unknown
}

export const GenerationBarDraggable = ({}: GenerationBarDraggableProps) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, offset: [ox, oy] }) => {
    void api.start({
      x: ox,
      y: oy,
      immediate: down,
      onChange: ({ value }) => {
        api.set({
          x: value.x,
          y: value.y,
        })
      },
    })
  })

  const DragBar = animated(GenerationForm)

  // const [genBarSize] = useAtom(getUiAtom('genBarSize'))
  return (
    <DragBar
      className={cn(
        'z-40 touch-manipulation self-center justify-self-start rounded border border-gray-7 bg-panel-solid px-4 py-4',
      )}
      {...bind()}
      style={{ x, y }}
    />
  )
}
