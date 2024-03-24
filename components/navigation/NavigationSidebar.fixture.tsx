'use client'

import { Button } from '@radix-ui/themes'
import { useSelect } from 'react-cosmos/client'
import { useAppStore } from '../providers/AppStoreProvider'
import { NavigationSidebar } from './NavigationSidebar'

const Nav = () => {
  const [side] = useSelect('side', {
    options: ['left', 'right'],
  })
  const left = side === 'left'
  const right = side === 'right'

  const toggleNavigationSidebar = useAppStore((state) => state.toggleNavigationSidebar)

  const mockContentArea = (
    <div className="flex-col-center w-full gap-2 border-2 border-yellow text-xl">
      Content area
      <Button onClick={() => toggleNavigationSidebar()}>Toggle Sidebar</Button>
    </div>
  )
  return (
    <div className="flex h-full overflow-hidden">
      {right && mockContentArea}
      <NavigationSidebar left={left} right={right} />
      {left && mockContentArea}
    </div>
  )
}

export default Nav
