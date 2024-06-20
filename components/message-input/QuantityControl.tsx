import { GridFour, Square } from '@phosphor-icons/react/dist/ssr'
import { SegmentedControl } from '@radix-ui/themes'

export const QuantityControl = ({
  n,
  ...props
}: { n: number } & React.ComponentProps<typeof SegmentedControl.Root>) => {
  const value = n === 1 ? '1' : '4'
  return (
    <SegmentedControl.Root value={value} {...props}>
      <SegmentedControl.Item value="1">
        <Square className="size-4" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="4">
        <GridFour className="size-5" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}
