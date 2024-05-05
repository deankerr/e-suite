import { forwardRef, useState } from 'react'
import { ScrollArea, TextField } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

import { useFormResource } from '@/components/command-bar/atoms'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { cn } from '@/lib/utils'
import { useModelList } from '../../lib/queries'

type ModelBrowserPanelProps = { props?: unknown } & React.ComponentProps<'div'>

export const ModelBrowserPanel = forwardRef<HTMLDivElement, ModelBrowserPanelProps>(
  function ModelBrowserPanel({ className, ...props }, forwardedRef) {
    const models = useModelList() ?? []
    const [searchValue, setSearchValue] = useState('')
    const { resId, set } = useFormResource()

    const searchResults = models.filter((model) =>
      model.name.toLowerCase().includes(searchValue.toLowerCase()),
    )

    return (
      <div
        {...props}
        className={cn(
          'flex h-full flex-col overflow-hidden border-2 border-mint-6 bg-mint-2 shadow-inner transition-all',
          className,
        )}
        ref={forwardedRef}
      >
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
              <ModelCard
                key={model.model_id}
                model={model}
                className={cn(
                  'cursor-pointer border border-gold-7',
                  resId === model.resId
                    ? 'border-grass-9 brightness-125'
                    : 'brightness-110 hover:border-gold-8',
                )}
                onClick={() => set(model)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  },
)
