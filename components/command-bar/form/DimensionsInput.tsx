import { CheckboxCards } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

import { FormLabel } from '@/components/command-bar/form/ParameterInputs'
import { cn } from '@/lib/utils'

export const DimensionsInput = () => {
  return (
    <div className={cn('grid max-w-80 gap-1 font-mono text-xs')}>
      <FormLabel htmlFor="dimensions">dimensions</FormLabel>
      <CheckboxCards.Root
        name="dimensions"
        id="dimensions"
        size="1"
        gap="2"
        columns="2"
        className="w-fit grid-cols-[1fr_auto]"
      >
        <CheckboxCards.Item id="dim1" value="square" itemID="dim1">
          <SquareIcon />
          <div className="font-sans font-medium">Square</div>
        </CheckboxCards.Item>

        <CheckboxCards.Item value="square_hd">HD</CheckboxCards.Item>

        <CheckboxCards.Item value="portrait_4_3">
          <RectangleVerticalIcon />
          <div className="font-sans font-medium">Portrait</div>
        </CheckboxCards.Item>

        <CheckboxCards.Item value="portrait_16_9">16:9</CheckboxCards.Item>

        <CheckboxCards.Item value="landscape_4_3">
          <RectangleHorizontalIcon />
          <div className="font-sans font-medium">Landscape</div>
        </CheckboxCards.Item>

        <CheckboxCards.Item value="landscape_16_9">16:9</CheckboxCards.Item>
      </CheckboxCards.Root>
    </div>
  )
}
