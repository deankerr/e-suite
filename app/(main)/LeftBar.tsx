'use client'

import { Sidebar } from '../components/Sidebar'

type LeftBarProps = {
  props?: any
}

// has-[:hover]:left-0 md:left-0
export const LeftBar = ({ props }: LeftBarProps) => {
  return <Sidebar side="left" className="overflow-clip px-4"></Sidebar>
}
