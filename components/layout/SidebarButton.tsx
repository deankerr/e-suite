'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { sidebarOpenAtom } from '@/components/layout/atoms'

export const SidebarButton = ({ ...props }: React.ComponentProps<typeof IconButton>) => {
  const [isOpen, toggle] = useAtom(sidebarOpenAtom)
  return (
    <IconButton
      variant="ghost"
      color="gray"
      className="md:hidden"
      onClick={() => toggle()}
      {...props}
    >
      <Icons.Sidebar className="size-6" />
    </IconButton>
  )
}
