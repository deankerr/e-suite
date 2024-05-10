import { forwardRef } from 'react'
import { Label } from '@radix-ui/react-label'
import { Checkbox, Select, TextArea, TextField } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

import type { ParameterFormInput } from '@/convex/lib/schemas'

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

export const FormInputText = (props: React.ComponentProps<typeof TextField.Root>) => {
  return <TextField.Root size="3" type="text" {...props} />
}

export const FormInputNumber = forwardRef<
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

export const FormInputCheckbox = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Checkbox>
>(function FormInputCheckbox({ className, ...props }, forwardedRef) {
  return <Checkbox {...props} className={cn('', className)} ref={forwardedRef} />
})

export const inputRegister = {
  constant: () => null,
  ignore: () => null,

  textarea: (props: ParameterFormInput) => (
    <FormControl key={props.name}>
      {props.label ?? props.name}
      <FormInputTextarea name={props.name} />
    </FormControl>
  ),

  text: (props: ParameterFormInput) => (
    <FormControl key={props.name} className="w-fit min-w-32">
      {props.label ?? props.name}
      <TextField.Root name={props.name} />
    </FormControl>
  ),

  number: (props: ParameterFormInput) => (
    <FormControl key={props.name} className="w-fit min-w-20">
      {props.label ?? props.name}
      <FormInputNumber name={props.name} placeholder={props.placeholder} {...props.number} />
    </FormControl>
  ),
  checkbox: (props: ParameterFormInput) => (
    <FormControl key={props.name} className="max-w-48 grid-cols-[2em_auto]">
      <FormInputCheckbox name={props.name} />
      {props.label ?? props.name}
    </FormControl>
  ),
  select: (props: ParameterFormInput) => (
    <FormControl key={props.name} className="w-48">
      {props.label ?? props.name}
      <FormInputSelect
        name={props.name}
        defaultValue={props?.items?.[0] ?? ''}
        items={props.items ?? []}
      />
    </FormControl>
  ),
} as const
