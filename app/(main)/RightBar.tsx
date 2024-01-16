'use client'

import { GenerationControls } from '../components/GenerationControls'
import { Sidebar } from '../components/Sidebar'

type RightBarProps = {
  props?: any
}

export const RightBar = ({ props }: RightBarProps) => {
  return (
    <Sidebar side="right">
      <GenerationControls />
    </Sidebar>
  )
}
