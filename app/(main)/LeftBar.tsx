'use client'

import { ImageModelCard } from '@/app/components/ImageModelCard'
import { api } from '@/convex/_generated/api'
import { ScrollArea } from '@radix-ui/themes'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { useRef, useState } from 'react'
import { Select } from '../components/ui/Select'

type LeftBarProps = {
  props?: any
}

export const LeftBar = ({ props }: LeftBarProps) => {
  // const models = useQuery(api.imageModels.list, { take: 5 })
  const [type, setType] = useState<'any' | 'checkpoint' | 'lora' | undefined>('any')
  const {
    results: models,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(api.imageModels.listPage, { type }, { initialNumItems: 5 })
  return (
    <div className="left-sidebar relative -left-96 z-20 h-full w-96 overflow-hidden border-r border-gray-6 bg-background shadow-[30px_0px_60px_-12px_rgba(0,0,0,0.9)] transition-all duration-300 has-[:hover]:left-0 md:left-0">
      <div className="text-xs">
        status: {status} | isLoading: {String(isLoading)} | type: {type}
      </div>
      <Select values={[['any'], ['checkpoint'], ['lora']] as const} onValueChange={setType} />
      <ScrollArea>
        <div className="flex flex-col justify-center gap-5 px-4 py-6">
          {models?.map((model) => <ImageModelCard key={model._id} imageModel={model} />)}
        </div>
      </ScrollArea>
    </div>
  )
}
