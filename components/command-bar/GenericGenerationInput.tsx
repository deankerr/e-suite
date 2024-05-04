import { forwardRef } from 'react'
import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { getInput, schemaGenericInputsData } from '@/components/command-bar/form/Controls'
import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { localSchema } from '@/convex/inferenceSchema'
import { cn } from '@/lib/utils'
import { modelSelectedAtom } from './atoms'

type GenericGenerationInputProps = { props?: unknown } & React.ComponentProps<'form'>

export const GenericGenerationInput = forwardRef<HTMLFormElement, GenericGenerationInputProps>(
  function GenericGenerationInput({ className, ...props }, forwardedRef) {
    const [modelSelected] = useAtom(modelSelectedAtom)
    const [provider, model] = modelSelected.split(':')

    const schema = provider && model ? getSchema(provider, model) : undefined
    const schemaKeys = schema ? Object.keys(schema?.shape ?? {}) : []

    return (
      <form
        {...props}
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
            {schemaGenericInputsData.full.map((data) => {
              if (!schemaKeys.includes(data.key)) return null
              return getInput(data.input, data)
            })}
          </div>

          <div className="flex gap-2">
            {schemaGenericInputsData.checks.map((data) => {
              if (!schemaKeys.includes(data.key)) return null
              return getInput(data.input, data)
            })}
          </div>

          {/* <div className="flex flex-wrap gap-2">
            {schemaGenericInputsData.fields.map((data) => {
              if (!schemaKeys.includes(data.key)) return null
              return getInput(data.input, data)
            })}
          </div> */}
          <div className="gap-2 flex-between">
            <DimensionsControl provider={provider} className="h-full" />
            <div className="h-full grow gap-1 flex-col-between">
              <QuantityControl />
              <Button variant="soft" color="gray" className="h-9">
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
