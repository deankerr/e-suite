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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { getAvailableChatModels } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { chatFormOpenAI, ChatFormSchemaOpenAI } from './schema'
import { SliderInput } from './slider-input'
import { TagInput } from './tag-input'

type Props = {} & React.ComponentProps<'form'>

const currentValues: Record<string, number> = {}

export const ChatForm = forwardRef<HTMLFormElement, Props>(function ChatForm(props, ref) {
  const models = getAvailableChatModels()

  const form = useForm<ChatFormSchemaOpenAI>({
    resolver: zodResolver(chatFormOpenAI.formSchema),
    defaultValues: chatFormOpenAI.defaultValues,
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
        onSubmit={form.handleSubmit((values) => console.log('submit:', values))}
        {...props}
      >
        <div className="grid grid-cols-[1fr,2fr,1fr] items-center justify-items-center">
          <div></div>
          {/* model select */}
          <FormField
            control={form.control}
            name="modelId"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="w-full pl-3 text-center font-normal">Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" variant="secondary" className="inline">
              Test Submit
            </Button>
          </div>
        </div>

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
            <FormItem className="flex w-full flex-col space-y-0">
              <div className="flex w-full items-center gap-3">
                <Switch
                  checked={getFieldEnabled('stop')}
                  onCheckedChange={(checked) => setFieldEnabled('stop', checked)}
                />
                <FormLabel className="font-mono">{field.name}</FormLabel>
              </div>
              <FormControl>
                <TagInput field={field} setEnabled={() => setFieldEnabled('stop', true)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})
