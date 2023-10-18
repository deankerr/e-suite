import { Combobox } from '@/components/ui/combobox'
import { ChatModelOption } from '@/lib/api'
import { raise } from '@/lib/utils'
import { ChatSession } from './types'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

// TODO probably remove this
export function ModelsCombobox({ session, updateSession, modelsAvailable }: Props) {
  const getKey = (provider: string, model: string) => `${provider}::${model}`

  const list = modelsAvailable.map((m) => ({ value: getKey(m.provider, m.model), label: m.label }))
  const current = getKey(session.parameters.provider, session.parameters.model)

  const handleModelSelect = (selected: string) => {
    updateSession((s) => {
      const { provider, model } =
        modelsAvailable.find((m) => getKey(m.provider, m.model) === selected) ??
        raise('model id not found')
      s.parameters.provider = provider
      s.parameters.model = model
    })
  }

  return (
    <Combobox
      items={list}
      buttonProps={{ className: 'w-[230px]' }}
      popoverProps={{ className: 'w-[230px]' }}
      selectText="Select model..."
      searchText="Search model..."
      value={current}
      onSelect={handleModelSelect}
    />
  )
}

type ModelsComboboxFormProps = {
  value: string
  onSelect: (value: string) => void
  modelsAvailable: ChatModelOption[]
}

export function ModelsComboboxForm({ value, onSelect, modelsAvailable }: ModelsComboboxFormProps) {
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
