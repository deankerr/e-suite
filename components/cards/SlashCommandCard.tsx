import { Label } from '@radix-ui/react-label'
import { Button } from '@radix-ui/themes'

import { TextField } from '@/components/form/TextField'
import { DimensionsControl } from '@/components/message-input/DimensionsControl'
import { QuantityControl } from '@/components/message-input/QuantityControl'
import { ModelPicker, ModelPickerCombobox } from '@/components/model-picker/ModelPicker'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EThread } from '@/convex/shared/types'
import { useImageModels } from '@/lib/queries'
import { cn } from '@/lib/utils'

type SlashCommand = EThread['slashCommands'][number]

export const SlashCommandCard = ({
  command,
  className,
  ...props
}: { command: SlashCommand } & React.ComponentProps<'div'>) => {
  const imageModels = useImageModels()
  // const chatModels = useChatModels()

  return (
    <div {...props} className={cn('flex flex-col gap-3 rounded-md border px-4 py-4', className)}>
      <TextField
        label="Command"
        placeholder="/realistic"
        defaultValue={command.command}
        className="text-xs font-semibold"
      />

      <Label className="grid text-xs font-semibold">
        Model
        {imageModels ? (
          <ModelPickerCombobox picker={<ModelPicker models={imageModels} />}>
            <Button variant="surface">
              {imageModels.find((m) => m.resourceKey === command.inference.resourceKey)?.name ??
                'Select Model'}
            </Button>
          </ModelPickerCombobox>
        ) : (
          <Button variant="surface" disabled>
            <LoadingSpinner className="bg-gray-11" />
          </Button>
        )}
      </Label>

      {command.inference.type === 'text-to-image' && (
        <div className="flex-between">
          <Label className="text-xs font-semibold">
            Quantity
            <QuantityControl n={command.inference.n} />
          </Label>

          <Label className="text-xs font-semibold">
            Dimensions
            <DimensionsControl width={command.inference.width} height={command.inference.height} />
          </Label>
        </div>
      )}
    </div>
  )
}
