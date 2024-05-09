import { Button, Checkbox, Slider } from '@radix-ui/themes'

import { useCmbr } from '@/components/command-bar/atoms'
import { cn } from '@/lib/utils'

type CmbDebugProps = { props?: unknown }

const HIDE = false

export const CmbrDebug = ({}: CmbDebugProps) => {
  const cmbr = useCmbr()

  return (
    <div
      className={cn(
        'fixed left-1/2 top-0 flex -translate-x-1/2 gap-2 bg-bronze-2 p-2 font-mono text-xs',
        HIDE && 'hidden',
      )}
    >
      <div className="grid gap-1">
        <Button variant="surface" className="font-mono" size="1" onClick={() => cmbr.reset()}>
          reset
        </Button>
      </div>
      <div className="grid gap-1">
        <Button
          variant="surface"
          className="font-mono"
          size="1"
          onClick={() => cmbr.set((o) => ({ ...o, isOpen: !o.isOpen }))}
        >
          {cmbr.values.isOpen ? 'open' : 'closed'}
        </Button>

        <div>
          <Checkbox
            checked={cmbr.values.isVisible}
            onCheckedChange={() => cmbr.set((o) => ({ ...o, isVisible: !o.isVisible }))}
          />
          visible
        </div>
      </div>
      <div className="w-40">
        <div>panel height</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{cmbr.values.panelHeight}</span>
          <span>1000</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={1000}
          value={[cmbr.values.panelHeight]}
          onValueChange={([v]) => cmbr.set((o) => ({ ...o, panelHeight: v ?? o.panelHeight }))}
        />
      </div>

      <div className="w-40">
        <div>container height %</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{cmbr.values.containerHeightPc}</span>
          <span>100%</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={100}
          value={[cmbr.values.containerHeightPc]}
          onValueChange={([v]) =>
            cmbr.set((o) => ({ ...o, containerHeightPc: v ?? o.containerHeightPc }))
          }
        />
      </div>
    </div>
  )
}
