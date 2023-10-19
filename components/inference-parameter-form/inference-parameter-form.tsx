'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ChatModelOption } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChatInferenceParameters } from '../chat/types'
import { ModelsComboboxForm } from './models-combobox'
import { ToggleSliderInput } from './toggle-slider-input'
import { ToggleTagInput } from './toggle-tag-input'

const max_tokens_max = 4097

export const formSchemaOpenAI = z.object({
  model: z.string().nonempty(),
  stream: z.boolean().optional(),
  temperature: z.coerce.number().gte(0).lte(2).optional(),
  frequency_penalty: z.coerce.number().gte(-2).lte(2).optional(),
  presence_penalty: z.coerce.number().gte(-2).lte(2).optional(),
  max_tokens: z.coerce.number().gte(1).lte(max_tokens_max).optional(),
  top_p: z.coerce.number().gte(0).lte(2).optional(),
  stop: z.string().array().optional(),
})
export type FormSchemaOpenAI = z.infer<typeof formSchemaOpenAI>

const inputPropsOAI = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.01,
  },
  frequency_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
  },
  presence_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
  },
  max_tokens: {
    min: 1,
    max: max_tokens_max,
    step: 1,
  },
  top_p: {
    min: 0,
    max: 2,
    step: 0.01,
  },
} as const

const oaiDefaultValues = {
  model: 'openai::gpt-3.5-turbo',
  stream: true,
  temperature: 1,
  max_tokens: max_tokens_max,
  frequency_penalty: 0,
  presence_penalty: 0,
  top_p: 1,
  stop: ['### INSTRUCTION:', 'you are a turkey'],
}

type Props = {
  defaultValues: ChatInferenceParameters
  modelsAvailable: ChatModelOption[]
  onSubmit: SubmitHandler<FormSchemaOpenAI>
} & Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>

export const InferenceParameterForm = forwardRef<HTMLFormElement, Props>(
  ({ modelsAvailable, onSubmit, defaultValues, ...props }, ref) => {
    const form = useForm<FormSchemaOpenAI>({
      resolver: zodResolver(formSchemaOpenAI),
      defaultValues: { ...oaiDefaultValues, ...defaultValues },
    })

    return (
      <Form {...form}>
        <form ref={ref} onSubmit={form.handleSubmit(onSubmit)} {...props}>
          {/* model combobox */}
          <div className="flex items-center justify-evenly py-1">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ModelsComboboxForm
                      value={field.value}
                      onSelect={field.onChange}
                      modelsAvailable={modelsAvailable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* temperature */}
          <ToggleSliderInput
            control={form.control}
            name="temperature"
            description="Higher values like 0.8 will make the output more random..."
            range={inputPropsOAI['temperature']}
            defaultEnabled={defaultValues['temperature'] !== undefined}
          />

          {/* frequency_penalty */}
          <ToggleSliderInput
            control={form.control}
            name="frequency_penalty"
            description="Positive values penalize new tokens based..."
            range={inputPropsOAI['frequency_penalty']}
            defaultEnabled={defaultValues['frequency_penalty'] !== undefined}
          />

          {/* presence_penalty */}
          <ToggleSliderInput
            control={form.control}
            name="presence_penalty"
            description="Positive values penalize new tokens based..."
            range={inputPropsOAI['presence_penalty']}
            defaultEnabled={defaultValues['presence_penalty'] !== undefined}
          />

          {/* top_p */}
          <ToggleSliderInput
            control={form.control}
            name="top_p"
            description="An alternative to sampling with temperature..."
            range={inputPropsOAI['top_p']}
            defaultEnabled={defaultValues['top_p'] !== undefined}
          />

          {/* max_token */}
          <ToggleSliderInput
            control={form.control}
            name="max_tokens"
            description="The maximum number of tokens to generate...."
            range={inputPropsOAI['max_tokens']}
            defaultEnabled={defaultValues['max_tokens'] !== undefined}
          />

          {/* stop values */}
          <ToggleTagInput
            control={form.control}
            name="stop"
            description="put a stop to it"
            defaultEnabled={defaultValues['stop'] !== undefined}
          />

          {/* stream */}
          {/* <FormField
          control={form.control}
          name="stream"
          render={({ field }) => (
            <FormItem>
              <div className="flex w-fit items-center gap-2 px-2 py-1.5">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Stream</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        /> */}
          {/* <Button type="submit" variant="secondary" className="inline">
          Test Submit
        </Button> */}
        </form>
      </Form>
    )
  },
)
InferenceParameterForm.displayName = 'InferenceParameterForm'
