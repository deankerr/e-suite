import { Select as RadixSelect } from '@radix-ui/themes'

type List = { label?: string; value: string }[] | string[] | number[]

type SelectList = { items: List; placeholder?: string } & Partial<
  React.ComponentProps<typeof RadixSelect.Root>
>

export const SelectList = ({ items, placeholder, ...props }: SelectList) => {
  const list = items.map((item) =>
    typeof item === 'object' ? item : { label: String(item), value: String(item) },
  )
  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.Trigger
        variant="surface"
        placeholder={placeholder ?? 'Select an item'}
        className="w-full"
      />
      <RadixSelect.Content variant="soft">
        <RadixSelect.Group>
          {list.map(({ label, value }) => (
            <RadixSelect.Item key={value} value={value}>
              {label ?? value}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Group>
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
}
