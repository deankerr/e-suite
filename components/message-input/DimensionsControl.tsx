import { Rectangle, Square } from '@phosphor-icons/react/dist/ssr'
import { SegmentedControl } from '@radix-ui/themes'

export const DimensionsControl = (props: React.ComponentProps<typeof SegmentedControl.Root>) => {
  return (
    <SegmentedControl.Root {...props}>
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
