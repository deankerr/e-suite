import { CheckboxCards } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

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
type DimensionsControlProps = { provider?: string } & React.ComponentProps<'div'>

export const DimensionsControl = ({ provider, className, ...props }: DimensionsControlProps) => {
  const enableHdSizes = provider === 'fal'
  return (
    <div {...props} className={cn('grid h-fit max-w-80 gap-1 font-mono text-xs', className)}>
      <FormLabel htmlFor="dimensions">dimensions</FormLabel>
      <CheckboxCards.Root
        id="dimensions"
        size="1"
        gap="2"
        columns="2"
        style={{ gridTemplateColumns: '1fr auto' }}
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
