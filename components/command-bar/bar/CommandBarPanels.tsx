import { useCommandBar } from '@/components/command-bar/atoms'

export const CommandBarPanels = () => {
  const cmbr = useCommandBar()

  return (
    <div className="rounded-lg bg-gray-2" style={{ height: cmbr.layout.panelInnerHeight }}>
      CommandBarPanels
    </div>
  )
}
