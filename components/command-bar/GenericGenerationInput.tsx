import { forwardRef } from 'react'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { FormCheckbox, FormPrompt, FormSelect } from '@/components/command-bar/form/Controls'
import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { localSchema } from '@/convex/inferenceSchema'
import { cn } from '@/lib/utils'
import { modelSelectedAtom, useReadForm } from './atoms'

type GenericGenerationInputProps = { props?: unknown } & React.ComponentProps<'form'>

export const GenericGenerationInput = forwardRef<HTMLFormElement, GenericGenerationInputProps>(
  function GenericGenerationInput({ className, ...props }, forwardedRef) {
    const [modelSelected] = useAtom(modelSelectedAtom)
    const [provider, model] = modelSelected.split(':')

    const schema = provider && model ? getSchema(provider, model) : undefined
    const keys = schema ? Object.keys(schema.shape ?? {}).concat(['dimensions', 'quantity']) : []

    const readForm = useReadForm(keys)
    const handleSubmit = () => {
      const inputs = readForm()
      console.log(inputs)
    }

    return (
      <form
        {...props}
        action={handleSubmit}
        className={cn('grid grid-cols-[auto_1fr] gap-2 p-1 @container', className)}
        ref={forwardedRef}
      >
        <div className="gap-2 flex-col-start">
          <ModelCard variant="nano" resId={modelSelected} className="" />
          <ModelCard variant="nano" resId={modelSelected} className="" />
          <ModelCard variant="nano" resId={modelSelected} className="" />
        </div>

        <div className="flex flex-col justify-between gap-2">
          <div className="grow space-y-2">
            <FormPrompt name="prompt" keys={keys} />
            <FormPrompt name="negative_prompt" keys={keys} />
            <FormSelect name="style" itemsKey="style" keys={keys} />
          </div>

          <div className="flex gap-2">
            <FormCheckbox name="lcm" keys={keys} />
            <FormCheckbox name="use_default_neg" keys={keys} />
            <FormCheckbox name="enable_safety_checker" keys={keys} />
            <FormCheckbox name="expand_prompt" keys={keys} />
          </div>

          <div className="gap-2 flex-between">
            <DimensionsControl />
            <div className="h-full grow gap-1 flex-col-between">
              <QuantityControl />
              <Button type="button" variant="soft" color="gray" className="h-9">
                Save
              </Button>
              <Button variant="surface" className="h-9 w-3/4">
                Run
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute right-0 font-mono text-xs text-gold-9">
          {provider} {model}
        </div>
      </form>
    )
  },
)

const getSchema = (provider: string, model_id: string) => {
  if (provider === 'sinkin') return localSchema.sinkin.textToImage

  return model_id in localSchema.fal
    ? localSchema.fal[model_id as keyof typeof localSchema.fal]
    : undefined
}
