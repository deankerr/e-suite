import { Model } from '@/data/types'
import { Button, Popover, Text } from '@radix-ui/themes'
import { ModelFilterableList } from './ModelFilterableList'

type ModelSelectBoxProps = {
  models: Model[]
  value?: Model
  onValueChange?: (id: string) => void
}

export const ModelSelectBox = ({ models, value, onValueChange }: ModelSelectBoxProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" color="gray" className="w-64 truncate hover:cursor-pointer">
          <Text as="span" className="truncate">
            {value ? value.name : 'Select Model'}
          </Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content align="center">
        <ModelFilterableList items={models} onValueChange={onValueChange} />
      </Popover.Content>
    </Popover.Root>
  )
}
