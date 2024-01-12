import { Select as RadixSelect } from '@radix-ui/themes'
import { forwardRef } from 'react'

type Props = {
  defaultValue?: string
  values?: Array<[string]> | Array<[string, string]>
}

export const Select = forwardRef<HTMLDivElement, Props>(function Select(
  { defaultValue, values },
  ref,
) {
  return (
    <RadixSelect.Root defaultValue={defaultValue}>
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
