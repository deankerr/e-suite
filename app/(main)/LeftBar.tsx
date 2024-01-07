'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { ModelCard } from '../components/ModelCard'

type LeftBarProps = {
  props?: any
}

export const LeftBar = ({ props }: LeftBarProps) => {
  const models = useQuery(api.generations.listModels)
  return (
    <div className="left-sidebar relative -left-80 h-full w-96 overflow-y-auto overflow-x-hidden border-r border-gray-6 bg-background py-4 transition-all duration-300 has-[:hover]:left-0 md:left-0">
      <div className="flex flex-col justify-center gap-5 px-4 py-2">
        {models?.map((model) => (
          <ModelCard
            key={model.id}
            imageUrl={model.cover_img}
            civitaiUrl={model.link}
            name={model.name}
            tags={model.tags}
          />
        ))}
      </div>
    </div>
  )
}
