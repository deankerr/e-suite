'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TextareaAutosize } from '@/components/ui/textarea-autosize'
import { getEngines } from '@/lib/api/engines'
import { EChatEngine } from '@/lib/api/schema'
import { schemas } from '@/lib/api/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { HeartIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { forwardRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { EngineInput } from '../types'
import { chatFormOpenAI, ChatFormSchemaOpenAI } from './schema'
import { SliderInput } from './slider-input'
import { TagBadge } from './tag-badge'

const zExtra = z.object({
  engineId: z.string().nonempty(),
  fieldsEnabled: z.string().array(),
})

const extraDefaults = {
  fieldsEnabled: [],
}

const ignoredKeys = ['model', 'prompt', 'messages'] as const

console.log('chatFormOpenAI.', chatFormOpenAI.formSchema.shape)
console.log('oai', schemas.openai.chat.input.shape)

type Props = {
  handleSubmit: SubmitHandler<ChatFormSchemaOpenAI>
  engine: EChatEngine
  currentInput: EngineInput
} & React.ComponentProps<'form'>

export const ChatForm = forwardRef<HTMLFormElement, Props>(function ChatForm(
  { handleSubmit, engine, currentInput, ...props },
  ref,
) {
  const engines = getEngines()

  const form = useForm<ChatFormSchemaOpenAI>({
    resolver: zodResolver(chatFormOpenAI.formSchema),
    defaultValues: {
      ...chatFormOpenAI.defaultValues,
      ...currentInput,
      engineId: engine.id,
    },
  })

  const fieldsEnabled = form.watch('fieldsEnabled')
  const getFieldEnabled = (name: keyof ChatFormSchemaOpenAI) => fieldsEnabled.includes(name)
  const setFieldEnabled = (name: keyof ChatFormSchemaOpenAI, enabled: boolean) => {
    const fields = form.getValues('fieldsEnabled')
    if (enabled && !fields.includes(name)) {
      form.setValue('fieldsEnabled', [...fields, name])
    } else if (!enabled && fields.includes(name)) {
      form.setValue(
        'fieldsEnabled',
        fields.filter((field) => field !== name),
      )
    }
  }

  const submit = (values: ChatFormSchemaOpenAI) => {
    console.log('submit', values)
    handleSubmit(values)
    form.resetField('message')
  }

  const sliderInputFields = [
    'temperature',
    'frequency_penalty',
    'presence_penalty',
    'max_tokens',
    'top_p',
  ] as const

  return (
    <Form {...form}>
      <form
        ref={ref}
        onSubmit={form.handleSubmit(submit, (err) => console.log('submit error:', err))}
        {...props}
      >
        {/* model select */}
        <FormField
          control={form.control}
          name="engineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only mx-auto block text-center font-normal">Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="mx-auto w-64">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {engines.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.metadata.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* slider inputs */}
        {sliderInputFields.map((name) => {
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col space-y-0">
                  <div className="flex w-full items-center gap-3">
                    <Switch
                      checked={getFieldEnabled(name)}
                      onCheckedChange={(checked) => setFieldEnabled(name, checked)}
                    />
                    <FormLabel className="font-mono">{field.name}</FormLabel>
                  </div>
                  <FormControl>
                    <SliderInput
                      field={field}
                      range={chatFormOpenAI.inputValues[name]}
                      setEnabled={() => setFieldEnabled(name, true)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}

        {/* tag input */}
        <FormField
          control={form.control}
          name="stop"
          render={({ field }) => (
            <FormItem className="space-x-1">
              <div className="flex items-center gap-3">
                <Switch
                  checked={getFieldEnabled('stop')}
                  onCheckedChange={(checked) => setFieldEnabled('stop', checked)}
                />
                <FormLabel className="font-mono">{field.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add stop sequence..."
                    className="ml-1 h-8 w-52 grow"
                    onKeyDown={(e) => {
                      const value = e.currentTarget.value
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      if (!value || field.value.includes(value)) return

                      setFieldEnabled('stop', true)
                      field.onChange([...field.value, value])
                      e.currentTarget.value = ''
                    }}
                  />
                </FormControl>
              </div>
              {field.value.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  onButtonClick={() => {
                    setFieldEnabled('stop', true)
                    field.onChange(field.value.filter((t) => t !== tag))
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <Button type="submit">Test Submit</Button> */}

        {/* Dynamic Textarea */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mx-auto flex flex-col space-y-0">
              <FormLabel className="sr-only font-mono">{field.name}</FormLabel>
              <FormControl>
                <div className="flex items-end rounded-3xl border bg-background px-2 py-2 focus-within:ring-1 focus-within:ring-ring">
                  <Button className="rounded-2xl" variant="outline" type="button">
                    <HeartIcon />
                  </Button>
                  <TextareaAutosize
                    className="w-full resize-none bg-transparent px-2 py-1.5 placeholder:text-muted-foreground focus-visible:outline-none"
                    placeholder="Speak..."
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.metaKey) {
                        form.handleSubmit(submit)()
                      }
                    }}
                    {...field}
                  />
                  <Button
                    className="rounded-2xl"
                    variant={field.value !== '' ? 'default' : 'outline'}
                    type="submit"
                  >
                    <PaperPlaneIcon />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})
