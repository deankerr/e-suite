'use client'

import { useValue } from 'react-cosmos/client'
import { ThreadShell } from './ThreadShell'

const Fixture = () => {
  const [leftSidebarOpen] = useValue('left sidebar open', { defaultValue: true })
  const [rightSidebarOpen] = useValue('right sidebar open', { defaultValue: true })
  const sidebarState = { left: leftSidebarOpen, right: rightSidebarOpen }
  return <ThreadShell sidebarState={sidebarState} />
}

export default Fixture
