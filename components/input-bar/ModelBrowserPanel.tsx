import { useState } from 'react'
import { Button, ScrollArea, TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

import { ModelCard } from '@/components/cards/ModelCard'
import { useModelList } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { Temp_EModels } from '@/convex/models'

type Props = {
  currentModel?: Temp_EModels[number]
  setCurrentModel: (model: Temp_EModels[number]) => void
  setPanel: (panel: string) => void
}

export const ModelBrowserPanel = ({ currentModel, setCurrentModel, setPanel }: Props) => {
  const models = useModelList() ?? []
  const [searchValue, setSearchValue] = useState('')

  const searchResults = models.filter((model) =>
    model.name.toLowerCase().includes(searchValue.toLowerCase()),
  )
  return (
    <div className="space-y-2 overflow-hidden">
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

      <ScrollArea className="h-96">
        <div className="flex flex-wrap justify-evenly gap-2 p-1">
          {searchResults.map((model) => (
            <ModelCard
              key={model.model_id}
              model={model}
              className={cn(
                'cursor-pointer border border-gold-7',
                currentModel?.resId === model.resId
                  ? 'border-grass-9 brightness-125'
                  : 'brightness-110 hover:border-gold-8',
              )}
              onClick={() => setCurrentModel(model)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="gap-2 flex-end">
        <Button variant="soft" onClick={() => setPanel('textarea')}>
          Cancel
        </Button>
        <Button variant="surface" onClick={() => setPanel('textarea')}>
          Save
        </Button>
      </div>
    </div>
  )
}
