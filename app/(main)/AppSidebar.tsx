'use client'

import { Sidebar } from '@/components/ui/Sidebar'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type AppSidebarProps = {
  className?: React.ComponentProps<'div'>['className']
}

export const AppSidebar = ({ className }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className={cn('', className)}>
      <Sidebar />
    </div>
  )
}
