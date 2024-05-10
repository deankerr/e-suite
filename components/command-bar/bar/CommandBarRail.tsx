import { Button, IconButton } from '@radix-ui/themes'
import { MenuIcon } from 'lucide-react'

import { panels, useCommandBar } from '@/components/command-bar/atoms'
import { Monitor } from '@/components/command-bar/Monitor'

export const CommandBarRail = () => {
  const cmbr = useCommandBar()

  return (
    <div
      className="flex items-center gap-1 rounded-lg bg-gray-2 p-2"
      style={{ height: cmbr.layout.railInnerHeight }}
    >
      <IconButton
        variant="surface"
        size="3"
        onClick={() => cmbr.set((o) => ({ ...o, isOpen: !o.isOpen }))}
      >
        <MenuIcon />
      </IconButton>

      {panels.map((panel, i) => (
        <Button
          key={panel.id}
          variant="surface"
          size="3"
          {...panel.button}
          onClick={() => cmbr.set((o) => ({ ...o, panelIndex: i, isOpen: true }))}
        >
          {panel.name}
        </Button>
      ))}

      <Monitor />
    </div>
  )
}
