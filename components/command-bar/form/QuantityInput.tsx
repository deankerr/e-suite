import { SegmentedControl } from '@radix-ui/themes'

import { FormLabel } from '@/components/command-bar/form/Controls'

export const QuantityInput = () => {
  return (
    <div className="grid h-fit gap-1.5 font-mono text-xs">
      <FormLabel htmlFor="quantity" className="">
        quantity
      </FormLabel>
      <SegmentedControl.Root id="quantity" defaultValue="2" size="3">
        <SegmentedControl.Item value="1" className="font-mono">
          1
        </SegmentedControl.Item>
        <SegmentedControl.Item value="2" className="font-mono">
          2
        </SegmentedControl.Item>
        <SegmentedControl.Item value="3" className="font-mono">
          3
        </SegmentedControl.Item>
        <SegmentedControl.Item value="4" className="font-mono">
          4
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  )
}
