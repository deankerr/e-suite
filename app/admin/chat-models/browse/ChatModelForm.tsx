import { useState } from 'react'
import { z } from 'zod'

import { BohNumberInput, BohTextareaInput, BohTextInput } from '@/components/ui/form'
import { chatModelFields } from '@/convex/schema'
import { cn } from '@/lib/utils'

type ChatModelSchema = z.infer<typeof chatModelSchema>
const chatModelSchema = z.object(chatModelFields)

const defaultValues = chatModelSchema.parse({
  slug: '',
  name: '',
  description: '',
  creatorName: '',
  link: '',
  license: '',
  tags: [],
  numParameters: -1,
  contextLength: 1024,
  tokenizer: '',
  stop: [],
  endpoints: [
    {
      endpoint: '',
      model: '',
      pricing: {},
      modelDataSource: '',
    },
  ],
})

const useForm = <State extends Record<string, unknown>>(initialState: State) => {
  const [values, setValues] = useState(chatModelSchema.parse(initialState))
  const update = <Key extends keyof State>(name: Key, value: State[Key]) =>
    setValues((form) => ({ ...form, [name]: value }))

  return [values, update] as const
}

export const ChatModelForm = ({
  initialState = defaultValues,
  className,
  ...props
}: { initialState?: ChatModelSchema } & React.ComponentProps<'form'>) => {
  const [values, _update] = useForm(initialState)
  const stringOrNumberFields = Object.entries(values).filter(
    ([_, value]) => typeof value === 'string' || typeof value === 'number',
  )
  const listFields = Object.entries(values).filter(([_, value]) => Array.isArray(value))
  return (
    <form {...props} className={cn('space-y-2', className)}>
      <div className="wt-title-4">edit chat model</div>

      <div>
        {values.endpoints.map((ep) => (
          <div key={ep.endpoint} className="flex gap-2">
            <div className="text-sm font-semibold">
              {ep.endpoint}::{ep.model}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {stringOrNumberFields.map(([key, defaultValue]) => {
          if (key === 'description' && typeof defaultValue === 'string') {
            return (
              <BohTextareaInput
                key={key}
                name={key}
                defaultValue={defaultValue}
                rows={6}
                className="w-full shrink-0"
              />
            )
          }
          switch (typeof defaultValue) {
            case 'string':
              return (
                <BohTextInput
                  key={key}
                  name={key}
                  defaultValue={defaultValue}
                  className="w-full shrink-0"
                />
              )
            case 'number':
              return (
                <BohNumberInput
                  key={key}
                  name={key}
                  defaultValue={defaultValue}
                  className="shrink-0"
                />
              )
            default:
              return <div key={key}>{key}?</div>
          }
        })}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold">comma delimited lists</div>
        <div className="flex flex-wrap gap-3">
          {listFields.map(([key, defaultValue]) => {
            if (key === 'endpoints' || !Array.isArray(defaultValue)) return null
            return (
              <BohTextInput
                key={key}
                name={key}
                defaultValue={defaultValue.join(',')}
                className="w-full shrink-0"
              />
            )
          })}
        </div>
      </div>
    </form>
  )
}
