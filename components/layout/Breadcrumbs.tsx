'use client'

import { MessageSquareMoreIcon, MessagesSquareIcon } from 'lucide-react'
import { useSelectedLayoutSegments } from 'next/navigation'

export const Breadcrumbs = () => {
  const segments = useSelectedLayoutSegments()
  const [route = ''] = segments
  return (
    <h2 className="grow gap-1 text-sm tracking-tight flex-start md:text-base">{routes[route]}</h2>
  )
}

const routes: Record<string, React.ReactNode> = {
  dashboard: 'Dashboard',
  thread: <MessagesSquareIcon />,
  message: <MessageSquareMoreIcon />,
}
