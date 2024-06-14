import { SegmentedControl } from '@radix-ui/themes'
import { Grid2X2Icon, SquareIcon } from 'lucide-react'

export const QuantityControl = ({
  n,
  ...props
}: { n: number } & React.ComponentProps<typeof SegmentedControl.Root>) => {
  const value = n === 1 ? '1' : '4'
  return (
    <SegmentedControl.Root value={value} {...props}>
      <SegmentedControl.Item value="1">
        <SquareIcon className="size-4" />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="4">
        <Grid2X2Icon className="size-5" />
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}
