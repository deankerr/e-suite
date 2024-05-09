import { useState } from 'react'
import { ScrollArea, TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

import { useCurrentModelAtom } from '@/components/command-bar/atoms'
import { PanelShell } from '@/components/command-bar/PanelShell'
import { ModelCard } from '@/components/generation/ModelCard'
import { useModelList } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const ModelBrowserPanel = () => {
  const models = useModelList() ?? []
  const [searchValue, setSearchValue] = useState('')
  const [currentModel, setCurrentModel] = useCurrentModelAtom()

  const searchResults = models.filter((model) =>
    model.name.toLowerCase().includes(searchValue.toLowerCase()),
  )
  return (
    <PanelShell className="space-y-2 p-2">
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

      <ScrollArea>
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
    </PanelShell>
  )
}

export const modelBrowserPanelDef = {
  id: 'models',
  name: 'Models',
  buttonColor: 'orange',
  element: ModelBrowserPanel,
}
