import { PanelShell } from '@/components/command-bar/PanelShell'
import { Spinner } from '@/components/ui/Spinner'

export const LogPanel = () => {
  return (
    <PanelShell>
      <div className="p-2">
        <div className="mx-auto font-mono">
          image generation in progress <Spinner className="-mb-1.5" variant="ping" />
        </div>
      </div>
    </PanelShell>
  )
}

export const logsPanelDef = {
  id: 'logs',
  name: 'Logs',
  buttonColor: 'amber',
  element: LogPanel,
}
