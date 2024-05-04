import { forwardRef } from 'react'
import { Button } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

import { FormCheckbox, FormPrompt, FormSelect } from '@/components/command-bar/form/Controls'
import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { api } from '@/convex/_generated/api'
import { localSchema } from '@/convex/inferenceSchema'
import { cn } from '@/lib/utils'
import { modelSelectedAtom, threadIdAtom, useReadForm } from './atoms'

import type { Id } from '@/convex/_generated/dataModel'
import type { GenerationInputParams } from '@/convex/schema'
import type { GenerationProvider } from '@/convex/types'

type GenericGenerationInputProps = { threadId?: Id<'threads'> } & React.ComponentProps<'form'>

export const GenericGenerationInput = forwardRef<HTMLFormElement, GenericGenerationInputProps>(
  function GenericGenerationInput({ className, ...props }, forwardedRef) {
    const send = useMutation(api.messages.create)
    const [threadId] = useAtom(threadIdAtom)

    const [modelSelected] = useAtom(modelSelectedAtom)
    const [provider, model] = modelSelected.split(':')

    const schema = provider && model ? getSchema(provider, model) : undefined
    const keys = schema ? Object.keys(schema.shape ?? {}).concat(['dimensions', 'quantity']) : []

    const readForm = useReadForm(keys)
    const handleSubmit = () => {
      if (!threadId) {
        toast.error('missing threadId')
        return
      }

      const inputs = readForm().filter((input) => input.value !== '')
      const quantity = inputs.find((input) => input.name === 'quantity')
      const dimensions = inputs.find((input) => input.name === 'dimensions')

      if (!(Number(quantity?.value) && Array.isArray(dimensions?.value)))
        throw new Error('missing values')

      const bulk = dimensions.value.map((d) => getDim(d, Number(quantity?.value)))

      const params = Object.fromEntries(
        inputs
          .filter(
            (input) =>
              !['dimensions', 'quantity', 'expand_prompt', 'enable_safety_checker'].includes(
                input.name,
              ),
          )
          .map((input) => [input.name, input.value]),
      ) as unknown as GenerationInputParams

      console.log(bulk, inputs)
      send({
        threadId,
        message: {
          role: 'assistant',
          inference: {
            generation: {
              parameters: {
                ...params,
                provider: provider as GenerationProvider,
                model_id: model as string,
              },
              dimensions: bulk,
            },
          },
        },
      })
        .then(() => toast.success('Generation created'))
        .catch((err) => {
          toast.error(err.message)
        })
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

const getDim = (dim: unknown, n: number) => {
  if (typeof dim !== 'string') throw new Error('invalid dim')
  switch (dim) {
    case 'square':
      return { width: 512, height: 512, n }
    case 'square_hd':
      return { width: 1024, height: 1024, n }
    case 'portrait_4_3':
      return { width: 512, height: 768, n }
    case 'portrait_16_9':
      return { width: 768, height: 1024, n }
    case 'landscape_4_3':
      return { width: 768, height: 512, n }
    case 'landscape_16_9':
      return { width: 1024, height: 768, n }
  }
  throw new Error('invalid dim')
}
