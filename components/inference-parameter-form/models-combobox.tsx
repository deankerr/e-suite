import { Combobox } from '@/components/ui/combobox'
import { ChatModelOption } from '@/lib/api'

type Props = {
  value: string
  onSelect: (value: string) => void
  modelsAvailable: ChatModelOption[]
}

export function ModelsComboboxForm({ value, onSelect, modelsAvailable }: Props) {
  const list = modelsAvailable.map((m) => ({ value: m.id, label: m.label }))

  return (
    <Combobox
      items={list}
      buttonProps={{ className: 'w-[230px]' }}
      popoverProps={{ className: 'w-[230px]' }}
      selectText="Select model..."
      searchText="Search model..."
      value={value}
      onSelect={onSelect}
    />
  )
}
