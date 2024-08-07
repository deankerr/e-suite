'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtom } from 'jotai'

import { sidebarOpenAtom } from '@/components/layout/atoms'
import { IconButton } from '@/components/ui/Button'

export const SidebarButton = ({ ...props }: Partial<React.ComponentProps<typeof IconButton>>) => {
  const [isOpen, toggle] = useAtom(sidebarOpenAtom)
  return (
    <IconButton
      variant="ghost"
      color="gray"
      onClick={() => toggle()}
      aria-label={`Toggle sidebar ${isOpen ? 'open' : 'closed'}`}
      className="md:hidden"
      {...props}
    >
      <Icons.Sidebar size={20} />
    </IconButton>
  )
}
