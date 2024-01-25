import { Select as RadixSelect, Responsive } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  defaultValue?: string
  values?: Array<[string]> | Array<[string, string]>
  onValueChange?: (value: any) => unknown
  size?: Responsive<'1' | '2' | '3'>
  name?: string
} & React.ComponentProps<typeof RadixSelect.Root>

export const Select = forwardRef<HTMLButtonElement, Props>(function Select(
  { defaultValue, values, onValueChange, ...props },
  ref,
) {
  return (
    <RadixSelect.Root
      onValueChange={onValueChange}
      defaultValue={defaultValue ?? getFirst(values)}
      {...props}
    >
      <RadixSelect.Trigger ref={ref} />
      <RadixSelect.Content>
        {values?.map(([value, label]) => (
          <RadixSelect.Item key={value} value={value}>
            {label ?? value}
          </RadixSelect.Item>
        ))}
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
})

const getFirst = (values?: Array<[string]> | Array<[string, string]>) => {
  if (!values) return undefined
  const first = values[0]
  if (!first) return undefined
  return first[1] ?? first[0]
}
