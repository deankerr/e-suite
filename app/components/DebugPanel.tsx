'use client'

import { cn } from '@/lib/utils'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import {
  getUiAtom, type UiAtomNames
} from './atoms'

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

  return (
    <div className={cn('fixed min-w-20', sides[side])}>
      <ToggleButton name="generationsPanelOpen" />
      <ToggleButton name="userPanelOpen" />
    </div>
  )
}

const getStateProps = (value: boolean) =>
  value
    ? ({ variant: 'soft', color: 'blue' } as const)
    : ({ variant: 'surface', color: 'orange' } as const)

export const ToggleButton = ({ name }: { name: UiAtomNames }) => {
  const [value, toggle] = useAtom(getUiAtom( name ))

  return (
    <Button onClick={() => toggle()} size="1" {...getStateProps(value)}>
      {name}
    </Button>
  )
}
