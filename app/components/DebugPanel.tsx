'use client'

import { cn } from '@/lib/utils'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import {debugAuthStateUiAtom} from './atoms'

const sides = {
  tl: 'top-1 left-1',
  tr: 'top-1 right-1',
  bl: 'bottom-1 left-1',
  br: 'bottom-1 right-1',
} as const

type DebugPanelProps = {
  side?: keyof typeof sides
}

export const DebugPanel = ({ side = 'br' }: DebugPanelProps) => {
  const [debugAuthStateUi, setDebugAuthStateUiAtom] = useAtom(debugAuthStateUiAtom)

  return (
    <div className={cn('fixed min-w-20', sides[side])}>
      <Button onClick={() => setDebugAuthStateUiAtom(!debugAuthStateUi)}>authState</Button>
    </div>
  )
}
