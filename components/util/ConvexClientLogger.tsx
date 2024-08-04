'use client'

import { useKeyboardEvent } from '@react-hookz/web'
import { useConvex } from 'convex/react'

export const ConvexClientLogger = () => {
  const convex = useConvex()
  useKeyboardEvent('C', (e) => {
    if (!e.ctrlKey && !e.shiftKey) return
    const c = convex as unknown as { listeners: Map<string, any> }
    ;[...c.listeners.entries()].forEach(([key, listener]) => {
      console.log(key, listener)
    })
  })

  return null
}
