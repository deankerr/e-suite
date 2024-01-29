'use client'

import { cn } from '@/lib/utils'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { forceSignedOutUiAtom, navUserPanelOpenAtom } from './atoms'

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
  const [forceSignedOutUi, setForceSignedOutUi] = useAtom(forceSignedOutUiAtom)
  const [navUserOpen, setNavUserOpen] = useAtom(navUserPanelOpenAtom)

  const states = {
    true: { variant: 'soft', color: 'blue' },
    false: { variant: 'surface', color: 'orange' },
  } as const

  return (
    <div className={cn('fixed min-w-20', sides[side])}>
      <Button
        onClick={() => setNavUserOpen(!navUserOpen)}
        size="1"
        {...states[navUserOpen ? 'true' : 'false']}
      >
        navUserOpen
      </Button>
      <Button
        size="1"
        onClick={() => setForceSignedOutUi(!forceSignedOutUi)}
        {...states[forceSignedOutUi ? 'true' : 'false']}
      >
        forceSignedOutUiAtom
      </Button>
    </div>
  )
}
