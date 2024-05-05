import { forwardRef } from 'react'
import { Button } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { z } from 'zod'

import { FormCheckbox, FormPrompt, FormSelect } from '@/components/command-bar/form/Controls'
import { DimensionsControl } from '@/components/command-bar/form/DimensionsControl'
import { QuantityControl } from '@/components/command-bar/form/QuantityControl'
import { ModelCard } from '@/components/command-bar/ModelCard'
import { api } from '@/convex/_generated/api'
import { localSchema } from '@/convex/inferenceSchema'
import { useThreadCtx } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { useFormResource, useReadForm } from './atoms'

import type { GenerationInputParams } from '@/convex/schema'

type GenerationInputPanelProps = { props?: unknown } & React.ComponentProps<'div'>

export const GenerationInputPanel = forwardRef<HTMLDivElement, GenerationInputPanelProps>(
  function GenerationInputPanel({ className, ...props }, forwardedRef) {
    const thread = useThreadCtx()
    const send = useMutation(api.messages.create)

    const resource = useFormResource()
    const { provider, model_id, resId } = resource

    const schema = getSchema(provider, model_id)
    const keys = schema ? Object.keys(schema.shape ?? {}).concat(['dimensions', 'quantity']) : []

    const readForm = useReadForm(keys)
    const handleSubmit = () => {
      if (!thread?._id) {
        toast.error('missing threadId')
        return
      }
      if (!(provider && model_id)) {
        toast.error('no resource selected')
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
        threadId: thread._id,
        message: {
          role: 'assistant',
          inference: {
            generation: {
              parameters: {
                ...params,
                provider,
                model_id,
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
      <div
        {...props}
        id="gen"
        className={cn('h-full w-full p-1 transition-all ', className)}
        ref={forwardedRef}
      >
        <form className="grid grid-cols-[auto_1fr] gap-2 @container " action={handleSubmit}>
          <div className="gap-2 flex-col-start">
            <ModelCard variant="nano" resId={resId} className="" />
            <ModelCard variant="nano" resId={resId} className="" />
            <ModelCard variant="nano" resId={resId} className="" />
          </div>

          <div className="flex flex-col justify-between gap-2">
            {!resId && <div className="h-60 flex-col-center">no resource selected</div>}
            {!thread && <div className="h-60 flex-col-center">no thread selected</div>}
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

            <div className={cn('gap-2 flex-between', (!resId || !thread) && 'invisible')}>
              <DimensionsControl />
              <div className="h-full grow gap-1 flex-col-between">
                <QuantityControl />
                <Button type="button" variant="soft" color="gray" className="h-9">
                  Save
                </Button>
                <Button variant="surface" className="h-9 w-3/4" disabled={!thread}>
                  Run
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  },
)

const getSchema = (provider?: string, model_id?: string) => {
  if (!(provider && model_id)) return z.object({})

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
