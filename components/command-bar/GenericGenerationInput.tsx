import { forwardRef, useState } from 'react'
import { Checkbox, SegmentedControl } from '@radix-ui/themes'

import {
  FormControl,
  FormInputInteger,
  FormInputTextarea,
} from '@/components/command-bar/form/Controls'
import { SelectList } from '@/components/ui/SelectList'
import { generationProviders } from '@/convex/constants'
import { localSchema } from '@/convex/inferenceSchema'
import { modelsList } from '@/convex/models'
import { cn } from '@/lib/utils'

import type { ForwardRefExoticComponent } from 'react'

type GenericGenerationInputProps = { props?: unknown } & React.ComponentProps<'form'>

const gproviders = {
  sinkin: 'sinkin',
  fal: 'fal',
} as const

type Provider = keyof typeof gproviders

export const GenericGenerationInput = forwardRef<HTMLFormElement, GenericGenerationInputProps>(
  function GenericGenerationInput({ className, ...props }, forwardedRef) {
    const [provider, setProvider] = useState<(typeof generationProviders)[number]>('sinkin')
    const [model, setModel] = useState('')

    const schema = getSchema(provider, model)

    const schemaKeys = schema ? Object.keys(schema?.shape ?? {}) : []

    return (
      <form {...props} className={cn('', className)} ref={forwardedRef}>
        <FormControl>
          provider
          <SegmentedControl.Root
            value={provider}
            onValueChange={(v) => setProvider(v === 'fal' ? gproviders.fal : gproviders.sinkin)}
          >
            <SegmentedControl.Item value="sinkin">sinkin</SegmentedControl.Item>
            <SegmentedControl.Item value="fal">fal</SegmentedControl.Item>
          </SegmentedControl.Root>
        </FormControl>

        <FormControl>
          <SelectList
            items={modelsList
              .filter((m) => m.provider === provider)
              .map(({ model_id, name }) => ({
                label: name,
                value: model_id,
              }))}
            value={model}
            onValueChange={(v) => setModel(v)}
          />
        </FormControl>

        {schemaKeys.map((key) => {
          const Control = controls[key]

          if (Control)
            return (
              <FormControl key={key}>
                {key}
                <Control />
              </FormControl>
            )
          return (
            <span className="font-mono text-xs text-tomato-9" key={key}>
              {key}?{' '}
            </span>
          )
        })}

        {/* {provider} */}
        {/* {model} */}
        {/* {schemaKeys.map((k) => `${k}, `)} */}
        {/* {modelsList.map(({ name }) => `${name} `)} */}
      </form>
    )
  },
)

const getSchema = (provider: Provider, model_id: string) => {
  if (provider === 'sinkin') return localSchema.sinkin.textToImage

  return model_id in localSchema.fal
    ? localSchema.fal[model_id as keyof typeof localSchema.fal]
    : undefined
}

const controls: Record<string, ForwardRefExoticComponent<any>> = {
  prompt: FormInputTextarea,
  negative_prompt: FormInputTextarea,

  seed: FormInputInteger,
  steps: FormInputInteger,
  guidance_scale: FormInputInteger,
  num_inference_steps: FormInputInteger,

  lcm: Checkbox,
  use_default_neg: Checkbox,
  enable_safety_checker: Checkbox,
  expand_prompt: Checkbox,
}
