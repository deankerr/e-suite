'use client'

import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useValue } from 'react-cosmos/client'
import { ErrorBoundary } from 'react-error-boundary'
import { FallbackComponent, ThreadShell } from './ThreadShell'

const Fixture = () => {
  const [asCard] = useValue('as card', { defaultValue: false })

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <ThreadShell
        threadId={'m17fv0zvw1at9cyyjcke9zxt5h6kxr0j' as Id<'threads'>}
        className={cn(asCard && 'm-6 h-[calc(100%-3rem)] place-self-center rounded border')}
      />
    </ErrorBoundary>
  )
}

export default Fixture
