import { Rectangle, Square } from '@phosphor-icons/react/dist/ssr'
import { SegmentedControl } from '@radix-ui/themes'

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
        <Rectangle className="size-5 rotate-90 -scale-y-75" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="square">
        <Square className="size-5" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="landscape">
        <Rectangle className="size-5 -scale-y-75" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}
