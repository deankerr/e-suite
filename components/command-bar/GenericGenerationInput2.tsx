import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { modelSelectedAtom } from '@/components/command-bar/atoms'
import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'
import { ModelCard } from '@/components/command-bar/ModelCard'

type GenericGenerationInput2Props = { props?: unknown }

export const GenericGenerationInput2 = ({}: GenericGenerationInput2Props) => {
  const [modelSelected] = useAtom(modelSelectedAtom)

  return (
    <form className="grid grid-cols-[auto_1fr] gap-2 p-1 @container">
      <div className="gap-2 flex-col-center">
        <ModelCard variant="nano" resId={modelSelected} className="" />
        <ModelCard variant="nano" resId={modelSelected} className="" />
        <ModelCard variant="nano" resId={modelSelected} className="" />
      </div>
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
    </form>
  )
}
