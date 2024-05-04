import { CheckboxCards } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

import { useFormAtom, useSelectedModel } from '@/components/command-bar/atoms'
import { FormLabel } from '@/components/command-bar/form/Controls'
import { cn } from '@/lib/utils'

const sizes = [
  {
    value: 'square',
    label: 'square',
    icon: <SquareIcon className="size-5 stroke-[1.5]" />,
    hd: false,
  },
  {
    value: 'square_hd',
    label: 'hd',
    icon: <SquareIcon className="size-5 scale-125 stroke-[1.5]" />,
    hd: true,
  },
  {
    value: 'portrait_4_3',
    label: 'portrait 3:4',
    icon: <RectangleVerticalIcon className="size-5 stroke-[1.5]" />,
    hd: false,
  },
  {
    value: 'portrait_16_9',
    label: '9:16',
    icon: <RectangleVerticalIcon className="size-5 scale-x-100 scale-y-125 stroke-[1.5]" />,
    hd: true,
  },
  {
    value: 'landscape_4_3',
    label: 'landscape 4:3',
    icon: <RectangleHorizontalIcon className="size-5 stroke-[1.5]" />,
    hd: false,
  },
  {
    value: 'landscape_16_9',
    label: '16:9',
    icon: <RectangleHorizontalIcon className="size-5 scale-x-125 stroke-[1.5]" />,
    hd: true,
  },
]

export const DimensionsControl = () => {
  const { provider } = useSelectedModel()
  const enableHdSizes = provider === 'fal'

  const { value, set } = useFormAtom('dimensions', ['square'])
  return (
    <div className={cn('grid max-w-80 gap-1 font-mono text-xs')}>
      <FormLabel htmlFor="dimensions">dimensions</FormLabel>
      <CheckboxCards.Root
        id="dimensions"
        size="1"
        gap="2"
        columns="2"
        style={{ gridTemplateColumns: '1fr auto' }}
        value={value}
        onValueChange={set}
      >
        {sizes.map((size) => (
          <CheckboxCards.Item
            key={size.value}
            value={size.value}
            disabled={size.hd ? !enableHdSizes : false}
            className="font-mono"
          >
            {size.icon}
            {size.label}
          </CheckboxCards.Item>
        ))}
      </CheckboxCards.Root>
    </div>
  )
}
