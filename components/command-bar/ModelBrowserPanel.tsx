import { ModelCard } from '@/components/command-bar/ModelCard'
import { PanelShell } from '@/components/command-bar/PanelShell'

export const ModelBrowserPanel = () => {
  return (
    <PanelShell>
      <div className="p-2 flex-col-center">
        <ModelCard resId="fal:fal-ai/hyper-sdxl" />
      </div>
    </PanelShell>
  )
}

export const modelBrowserPanelDef = {
  id: 'models',
  name: 'Models',
  buttonColor: 'amber',
  element: ModelBrowserPanel,
}
