'use client'

import { cn } from '@/lib/utils'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import {
  createToggleAtom,
  forceSignedOutUiAtom,
  getToggleAtom,
  navUserPanelOpenAtom,
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
const togglerAtom = createToggleAtom({ name: 'lala', initialValue: false })

export const DebugPanel = ({ side = 'br' }: DebugPanelProps) => {
  const [forceSignedOutUi, setForceSignedOutUi] = useAtom(forceSignedOutUiAtom)
  const [navUserOpen, setNavUserOpen] = useAtom(navUserPanelOpenAtom)

  const [tog, toggleTog] = useAtom(togglerAtom)

  const states = {
    true: { variant: 'soft', color: 'blue' },
    false: { variant: 'surface', color: 'orange' },
  } as const

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

export const ToggleButton = ({ name }: { name: string }) => {
  const [value, toggle] = useAtom(getToggleAtom({ name }))

  return (
    <Button onClick={() => toggle()} size="1" {...getStateProps(value)}>
      {name}
    </Button>
  )
}
