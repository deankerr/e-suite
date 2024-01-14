'use client'

import { api } from '@/convex/_generated/api'
import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ModelCard } from '../components/ModelCard'

type LeftBarProps = {
  props?: any
}

export const LeftBar = ({ props }: LeftBarProps) => {
  // const models = useQuery(api.generations.listModels)
  return (
    <div className="left-sidebar relative -left-96 z-20 h-full w-96 overflow-hidden border-r border-gray-6 bg-background shadow-[30px_0px_60px_-12px_rgba(0,0,0,0.9)] transition-all duration-300 has-[:hover]:left-0 md:left-0">
      <ScrollArea>
        <div className="flex flex-col justify-center gap-5 px-4 py-6">
          {/* {models?.map((model) => (
            <ModelCard
              key={model.id}
              imageUrl={model.cover_img}
              civitaiUrl={model.link}
              name={model.name}
              tags={model.tags}
            />
          ))} */}
        </div>
      </ScrollArea>
    </div>
  )
}
