import { Combobox } from '@/components/ui/combobox'
import { ChatModelOption } from '@/lib/api'
import { raise } from '@/lib/utils'
import { ModelsCombobox } from './models-combobox'
import { ChatSession } from './types'

type Props = {
  session: ChatSession
  updateSession: (fn: (session: ChatSession) => void) => void
  modelsAvailable: ChatModelOption[]
}

export function ModelConfigPanel({ session, updateSession, modelsAvailable }: Props) {
  return (
    <div className="w-full bg-muted">
      <div>ModelConfigPanel</div>
      <ModelsCombobox
        session={session}
        updateSession={updateSession}
        modelsAvailable={modelsAvailable}
      />
    </div>
  )
}
