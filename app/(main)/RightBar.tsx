'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { GenerationParams } from '../components/GenerationParams'
import { Sidebar } from '../components/Sidebar'

type RightBarProps = {
  props?: any
}

export const RightBar = ({ props }: RightBarProps) => {
  const imageModels = useQuery(api.imageModels.list, { take: 1, type: 'checkpoint' })
  const imageModel = imageModels ? imageModels[0] : undefined

  return (
    <Sidebar side="right">
      <GenerationParams imageModel={imageModel} />
    </Sidebar>
  )
}
