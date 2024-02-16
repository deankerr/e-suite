'use client'

import { Id } from '@/convex/_generated/dataModel'
import { createShellContextAtom } from '../ui/shell.atoms'
import { ThreadShell } from './ThreadShell'

const config = {
  leftOpen: false,
  leftFloating: false,
  leftWidth: 256,
  rightOpen: true,
  rightFloating: false,
  rightWidth: 320,
} as const

const shellAtom = createShellContextAtom(config)
const Fixture = () => {
  return (
    <ThreadShell
      shellAtom={shellAtom}
      threadId={'m17968tyj6hdg6g8ktbd7avzz56khqk4' as Id<'threads'>}
    />
  )
}

export default Fixture
