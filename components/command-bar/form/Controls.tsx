import { forwardRef } from 'react'
import { Label } from '@radix-ui/react-label'
import { Checkbox, Select, TextArea, TextField } from '@radix-ui/themes'

import { useFormAtom } from '@/components/command-bar/atoms'
import { cn } from '@/lib/utils'

export const FormLabel = ({
  className,
  children,
  ...props
}: { htmlFor: string } & React.ComponentProps<'label'>) => {
  return (
    <Label className={cn('font-mono text-xs', className)} {...props}>
      {children}
    </Label>
  )
}

export const FormControl = ({ className, children, ...props }: React.ComponentProps<'label'>) => {
  return (
    <Label className={cn('grid gap-0.5 font-mono text-xs', className)} {...props}>
      {children}
    </Label>
  )
}

export const FormInputTextarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof TextArea>
>(function FormInputTextarea(props, forwardedRef) {
  return <TextArea size="3" {...props} ref={forwardedRef} />
})

export const FormInputInteger = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof TextField.Root>
>(function FormInputTextarea(props, forwardedRef) {
  return <TextField.Root size="3" type="number" {...props} ref={forwardedRef} />
})

export const FormInputSelect = forwardRef<
  HTMLButtonElement,
  { items: string[] } & React.ComponentProps<typeof Select.Root>
>(function FormInputSelect({ items, ...props }, forwardedRef) {
  return (
    <Select.Root size="3" {...props}>
      <Select.Trigger placeholder={'Select an item'} className="w-full" ref={forwardedRef} />
      <Select.Content>
        <Select.Group>
          {items.map((value) => (
            <Select.Item key={value} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
})

export const schemaGenericInputsData = {
  full: [
    { key: 'prompt', input: 'textarea', required: true },
    { key: 'negative_prompt', input: 'textarea' },
  ],

  fields: [
    { key: 'seed', input: 'integer' },
    { key: 'steps', input: 'integer' },
    { key: 'num_inference_steps', label: 'steps (1 - 20)', input: 'integer' },
    { key: 'guidance_scale', label: 'scale', input: 'integer' },
    { key: 'scale', input: 'integer' },
    {
      key: 'scheduler',
      input: 'select',

      items: ['DPMSolverMultistep', 'K_EULER_ANCESTRAL', 'DDIM', 'K_EULER', 'PNDM', 'KLMS'],
    },
  ],

  checks: [
    { key: 'lcm', input: 'checkbox' },
    { key: 'use_default_neg', input: 'checkbox' },
    { key: 'enable_safety_checker', input: 'checkbox' },
    { key: 'expand_prompt', input: 'checkbox' },
  ],
}

export const schemaInputsIgnored = [
  'model_id',
  'width',
  'height',
  'num_images',
  'format',
  'sync_mode',
]

type InputProps = { key: string; label?: string; required?: boolean; items?: string[] }

export const inputs: Record<string, (props: InputProps) => JSX.Element> = {
  textarea: (props: InputProps) => (
    <FormControl>
      {props.label ?? props.key}
      <FormInputTextarea name={props.key} />
    </FormControl>
  ),
  integer: (props: InputProps) => (
    <FormControl className="max-w-32">
      {props.label ?? props.key}
      <FormInputInteger name={props.key} />
    </FormControl>
  ),
  checkbox: (props: InputProps) => (
    <FormControl className="max-w-48 grid-cols-[2em_auto]">
      <Checkbox name={props.key} />
      {props.label ?? props.key}
    </FormControl>
  ),
  select: (props: InputProps) => (
    <FormControl className="max-w-32">
      {props.label ?? props.key}
      <FormInputSelect defaultValue={props?.items?.[0] ?? ''} items={props.items ?? []} />
    </FormControl>
  ),
}

export const getInput = (control: string, props: InputProps) => {
  const input = inputs[control]
  return input ? input(props) : <div>{control}?</div>
}

export const FormPrompt = ({
  name,
  label,
  defaultValue = '',
  keys,
}: {
  name: string
  label?: string
  required?: boolean
  defaultValue?: string
  keys: string[]
}) => {
  const { value, set } = useFormAtom(name, defaultValue)
  if (!keys.includes(name)) return null

  return (
    <FormControl>
      {label ?? name}
      <FormInputTextarea value={value} onChange={(e) => set(e.target.value)} />
    </FormControl>
  )
}

export const FormCheckbox = ({
  name,
  label,
  defaultValue = false,
  keys,
}: {
  name: string
  label?: string
  required?: boolean
  defaultValue?: boolean
  keys: string[]
}) => {
  const { value, set } = useFormAtom(name, defaultValue)
  if (!keys.includes(name)) return null

  return (
    <FormControl className="max-w-48 grid-cols-[2em_auto]">
      <Checkbox checked={value} onCheckedChange={set} />
      {label ?? name}
    </FormControl>
  )
}

export const FormSelect = ({
  name,
  label,
  defaultValue = '',
  itemsKey,
  keys,
}: {
  name: string
  label?: string
  required?: boolean
  defaultValue?: string
  itemsKey: keyof typeof formItems
  keys: string[]
}) => {
  const { value, set } = useFormAtom(name, defaultValue)
  if (!keys.includes(name)) return null

  return (
    <FormControl className="max-w-60">
      {label ?? name}
      <FormInputSelect
        value={value}
        onValueChange={set}
        defaultValue={defaultValue}
        items={formItems[itemsKey]}
      />
    </FormControl>
  )
}

const formItems = {
  style: [
    '(No style)',
    'Cinematic',
    'Photographic',
    'Anime',
    'Manga',
    'Digital Art',
    'Pixel art',
    'Fantasy art',
    'Neonpunk',
    '3D Model',
  ],
}
