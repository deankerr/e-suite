import { SegmentedControl } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

export const DimensionsControl = ({
  width,
  height,
  ...props
}: { width: number; height: number } & React.ComponentProps<typeof SegmentedControl.Root>) => {
  const ar = width / height
  const value = ar < 1 ? 'portrait' : ar > 1 ? 'landscape' : 'square'
  return (
    <SegmentedControl.Root value={value} {...props}>
      <SegmentedControl.Item value="portrait">
        <RectangleVerticalIcon className="size-5" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="square">
        <SquareIcon className="size-5" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="landscape">
        <RectangleHorizontalIcon className="size-5" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}
