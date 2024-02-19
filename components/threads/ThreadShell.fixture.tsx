'use client'

import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useValue } from 'react-cosmos/client'
import { ThreadShell } from './ThreadShell'

const Fixture = () => {
  const [asCard] = useValue('as card', { defaultValue: false })

  return (
    <ThreadShell
      threadId={'m17968tyj6hdg6g8ktbd7avzz56khqk4' as Id<'threads'>}
      className={cn(asCard && 'm-6 h-[calc(100%-3rem)] place-self-center rounded border')}
    />
  )
}

export default Fixture
