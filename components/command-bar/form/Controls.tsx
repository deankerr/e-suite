import { forwardRef } from 'react'
import { Label } from '@radix-ui/react-label'
import { Checkbox, Select, TextArea, TextField } from '@radix-ui/themes'

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

// type FormTextareaProps = { name: string; label?: string; placeholder?: string }

// export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
//   function FormTextarea({ className, ...props }, forwardedRef) {
//     return (
//       <div {...props} className={cn('', className)} ref={forwardedRef}>
//         <p>FormTextarea</p>
//       </div>
//     )
//   },
// )

/*
 Log file: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-ZtX6Hv/tsserver.log
2024-05-03 18:40:48.464 [info] <syntax> Trace directory: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-lLWyoB
2024-05-03 18:40:48.464 [info] <syntax> Forking...
2024-05-03 18:40:48.464 [info] <syntax> Starting...
2024-05-03 18:40:48.464 [info] <semantic> Log file: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-yHnUC8/tsserver.log
2024-05-03 18:40:48.465 [info] <semantic> Trace directory: /Users/dean/Library/Application Support/Code/logs/20240503T050831/window1/exthost/vscode.typescript-language-features/tsserver-log-GtMUf2

*/
