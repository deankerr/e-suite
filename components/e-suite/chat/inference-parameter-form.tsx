'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ChatModelOption } from '@/lib/api'
import { ExtractPropsOfType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CrossCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useRef, useState } from 'react'
import { Control, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ModelsComboboxForm } from './models-combobox'
import { InputSlider } from './slider-input'

const max_tokens_max = 4097

export const formSchemaOpenAI = z.object({
  model: z.string(),
  stream: z.boolean().optional(),
  temperature: z.coerce.number().gte(0).lte(2).optional(),
  frequency_penalty: z.coerce.number().gte(-2).lte(2).optional(),
  presence_penalty: z.coerce.number().gte(-2).lte(2).optional(),
  max_tokens: z.coerce.number().gte(1).lte(max_tokens_max).optional(),
  top_p: z.coerce.number().gte(0).lte(2).optional(),
  stop: z.string().array().optional(),
})
type FormSchemaOpenAI = z.infer<typeof formSchemaOpenAI>

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

function onSubmit(values: z.infer<typeof formSchemaOpenAI>) {
  console.log('submit!')
  console.log('values', values)
}

type Props = {
  modelsAvailable: ChatModelOption[]
}
export function InferenceParameterForm({ modelsAvailable }: Props) {
  const form = useForm<FormSchemaOpenAI>({
    resolver: zodResolver(formSchemaOpenAI),
    defaultValues: {
      model: 'openai::gpt-3.5-turbo',
      stream: true,
      temperature: 1,
      max_tokens: max_tokens_max,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      stop: ['### INSTRUCTION:', 'you are a turkey'],
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <ModelsComboboxForm
                  value={field.value}
                  onSelect={field.onChange}
                  modelsAvailable={modelsAvailable}
                />
              </FormControl>
              {/* <FormDescription>This is the model we will chat with.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* stream */}
        <FormField
          control={form.control}
          name="stream"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 px-2 py-1">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-mono">{field.name}</FormLabel>
              </div>
              {/* <FormDescription>Stream the result</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* temperature */}
        <ToggleSliderInputField
          control={form.control}
          inputName="temperature"
          inputDescription="Higher values like 0.8 will make the output more random..."
          inputProps={inputPropsOAI['temperature']}
        />

        {/* frequency_penalty */}
        <ToggleSliderInputField
          control={form.control}
          inputName="frequency_penalty"
          inputDescription="Positive values penalize new tokens based..."
          inputProps={inputPropsOAI['frequency_penalty']}
        />

        {/* presence_penalty */}
        <ToggleSliderInputField
          control={form.control}
          inputName="presence_penalty"
          inputDescription="Positive values penalize new tokens based..."
          inputProps={inputPropsOAI['presence_penalty']}
        />

        {/* top_p */}
        <ToggleSliderInputField
          control={form.control}
          inputName="top_p"
          inputDescription="An alternative to sampling with temperature..."
          inputProps={inputPropsOAI['top_p']}
        />

        {/* max_token */}
        <ToggleSliderInputField
          control={form.control}
          inputName="max_tokens"
          inputDescription="The maximum number of tokens to generate...."
          inputProps={inputPropsOAI['max_tokens']}
        />

        <TagInputControl
          control={form.control}
          inputName="stop"
          inputDescription="put a stop to it"
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

type ToggleSliderInputFieldProps = {
  control: Control<FormSchemaOpenAI>
  inputName: keyof ExtractPropsOfType<FormSchemaOpenAI, number | undefined>
  inputDescription: string
  inputProps: Record<string, unknown>
}

function ToggleSliderInputField({
  control,
  inputName,
  inputDescription,
  inputProps,
}: ToggleSliderInputFieldProps) {
  const [disabled, setDisabled] = useState(false)

  return (
    <FormField
      disabled={disabled}
      control={control}
      name={inputName}
      render={({ field }) => {
        const { value, ...rest } = field
        return (
          <FormItem className="flex w-full flex-col space-y-0 px-2 py-1">
            <div className="flex w-full items-center gap-3">
              <Switch checked={!disabled} onCheckedChange={(checked) => setDisabled(!checked)} />
              <FormLabel className="font-mono">{field.name}</FormLabel>
              {/* <FormDescription className="contents">{inputDescription}</FormDescription> */}
            </div>

            <FormControl>
              <div className="flex w-full space-x-1">
                <InputSlider {...rest} value={Number(value)} {...inputProps} />
                <Input
                  {...rest}
                  value={Number(value)}
                  className="w-20 px-1 text-right font-mono"
                  type="number"
                  {...inputProps}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

type TagInputControlProps = {
  control: Control<FormSchemaOpenAI>
  inputName: keyof ExtractPropsOfType<FormSchemaOpenAI, string[] | undefined>
  inputDescription: string
}
function TagInputControl({ control, inputName, inputDescription }: TagInputControlProps) {
  const [disabled, setDisabled] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <FormField
      disabled={disabled}
      control={control}
      name={inputName}
      render={({ field }) => {
        const fieldValue = field.value ?? []

        const addTag = () => {
          if (!inputRef.current) return
          const { value } = inputRef.current

          if (value === '' || fieldValue.includes(value)) return
          field.onChange([...fieldValue, value])
          inputRef.current.value = ''
        }

        return (
          <FormItem className="flex w-full flex-col px-2 py-1">
            <div className="flex w-full items-center gap-3">
              <Switch checked={!disabled} onCheckedChange={(checked) => setDisabled(!checked)} />
              <FormLabel className="font-mono">{field.name}</FormLabel>
              {/* <FormDescription className="contents">{inputDescription}</FormDescription> */}
            </div>
            <FormControl>
              {/* add tags */}
              <div className="mt-1 flex w-full gap-2">
                <Input
                  ref={inputRef}
                  className="font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) addTag()
                  }}
                />
                <Button variant="outline" type="button" onClick={addTag}>
                  <PlusCircledIcon />
                </Button>
              </div>
            </FormControl>
            {/* show / remove tags */}
            <div className="w-full space-y-1">
              {field.value?.map((v, i) => (
                <Badge
                  className="ml-1 justify-between gap-1 pr-1 font-sans text-sm font-normal"
                  key={v}
                >
                  {v}
                  <Button
                    className="h-5 w-7"
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      field.onChange([...fieldValue.filter((_, _i) => i !== _i)])
                    }}
                  >
                    <CrossCircledIcon />
                  </Button>
                </Badge>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
