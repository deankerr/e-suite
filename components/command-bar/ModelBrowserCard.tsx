import { useState } from 'react'
import { Card, Inset, ScrollArea, TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

import { modelsList } from '@/convex/models'
import { cn } from '../../lib/utils'

type ModelRecord = (typeof modelsList)[number]

export const ModelBrowserCard = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const searchResults = modelsList.filter((model) =>
    model.name.toLowerCase().includes(searchValue.toLowerCase()),
  )
  return (
    <div className="flex h-full flex-col overflow-hidden shadow-inner">
      <div className="shrink-0 p-3">
        <TextField.Root
          size="3"
          placeholder="Search models"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        >
          <TextField.Slot>
            <SearchIcon className="size-4" />
          </TextField.Slot>
        </TextField.Root>
      </div>

      <ScrollArea>
        <div className="flex flex-wrap justify-center gap-2 p-1">
          {searchResults.map((model) => (
            <ModelMiniCard
              key={model.model_id}
              model={model}
              isSelected={selectedModel === model.model_id}
              onClick={() => setSelectedModel(model.model_id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

const ModelMiniCard = ({
  model,
  isSelected = false,
  ...props
}: { model: ModelRecord; isSelected?: boolean } & React.ComponentProps<typeof Card>) => {
  const { cover_image, name } = model

  return (
    <Card {...props} className={cn('h-60 w-40 flex-none cursor-pointer')}>
      <div className={cn('absolute inset-0', isSelected && 'bg-grassA-7')}></div>
      <Inset side="top" className="h-40 overflow-hidden">
        {cover_image ? <img src={cover_image} alt="" className="" draggable={false} /> : null}
      </Inset>
      <div className="flex h-20">
        <div className="m-auto text-center text-sm font-medium">{name}</div>
      </div>
    </Card>
  )
}
