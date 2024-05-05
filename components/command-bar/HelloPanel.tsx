import { PanelShell } from '@/components/command-bar/PanelShell'

export const HelloPanel = () => {
  return (
    <PanelShell className="bg-pinkA-3">
      <div className="p-2 flex-col-center">
        <div className="mx-auto font-mono text-xl">{'Hello <3'}</div>
      </div>
    </PanelShell>
  )
}

export const helloPanelDef = {
  id: 'hello',
  name: 'Hello',
  buttonColor: 'pink',
  element: HelloPanel,
}
