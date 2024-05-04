import { Button } from '@radix-ui/themes'

import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'

type DimQuantityStartProps = { props?: unknown }

export const DimQuantityStart = ({}: DimQuantityStartProps) => {
  return (
    <div className="grid h-40 max-w-3xl gap-2 @lg:grid-cols-[2fr_1fr]">
      <DimensionsControl provider={'fal'} />
      <div className="grid h-full grid-rows-3 items-center">
        <QuantityControl />
        <div className="flex-center">
          <Button variant="soft" color="gray" size="3">
            Save
          </Button>
        </div>
        <div className="px-2 flex-center">
          <Button variant="surface" size="3" className="w-full">
            Run
          </Button>
        </div>
      </div>
    </div>
  )
}
