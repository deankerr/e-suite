import { Select as RadixSelect } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  defaultValue?: string
  values?: Array<[string]> | Array<[string, string]>
  onValueChange?: (value: any) => unknown
}

export const Select = forwardRef<HTMLDivElement, Props>(function Select(
  { defaultValue, values, onValueChange },
  ref,
) {
  return (
    <RadixSelect.Root defaultValue={defaultValue ?? getFirst(values)} onValueChange={onValueChange}>
      <RadixSelect.Trigger />
      <RadixSelect.Content ref={ref}>
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
