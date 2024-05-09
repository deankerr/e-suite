import { IconButton } from '@radix-ui/themes'
import { MenuIcon } from 'lucide-react'

import { useCommandBar } from '@/components/command-bar/atoms'

export const CommandBarRail = () => {
  const cmbr = useCommandBar()

  return (
    <div
      className="flex items-center justify-between rounded-lg bg-gray-2 p-2"
      style={{ height: cmbr.layout.railInnerHeight }}
    >
      <IconButton variant="surface" size="3">
        <MenuIcon />
      </IconButton>
    </div>
  )
}
