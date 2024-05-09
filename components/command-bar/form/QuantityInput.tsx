import { SegmentedControl } from '@radix-ui/themes'

import { useGenerationQuantity } from '@/components/command-bar/atoms'
import { FormLabel } from '@/components/command-bar/form/ParameterInputs'

export const QuantityInput = () => {
  const [value, set] = useGenerationQuantity()
  return (
    <div className="grid h-fit gap-1.5 font-mono text-xs">
      <FormLabel htmlFor="quantity">quantity</FormLabel>
      <SegmentedControl.Root id="quantity" size="3" value={value} onValueChange={set}>
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
