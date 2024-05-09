import { Button, Checkbox, Slider } from '@radix-ui/themes'

import { useCommandBar } from '@/components/command-bar/atoms'
import { cn } from '@/lib/utils'

type CmbDebugProps = { props?: unknown }

const HIDE = false

export const CmbrDebug = ({}: CmbDebugProps) => {
  const cmbr = useCommandBar()

  return (
    <div
      className={cn(
        'fixed right-2 top-16 grid gap-2 rounded-xl bg-bronze-2 p-2 font-mono text-xs',
        HIDE && 'hidden',
      )}
    >
      <Button
        variant="surface"
        className="font-mono"
        size="1"
        onClick={() => cmbr.set((o) => ({ ...o, isOpen: !o.isOpen }))}
      >
        {cmbr.isOpen ? 'open' : 'closed'}
      </Button>

      <Button variant="surface" className="font-mono" size="1" onClick={() => cmbr.reset()}>
        reset
      </Button>

      <div className="flex gap-1">
        <Checkbox
          checked={cmbr.isHidden}
          onCheckedChange={() => cmbr.set((o) => ({ ...o, isHidden: !o.isHidden }))}
        />
        hidden
      </div>

      <div className="w-40">
        <div>container height</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{cmbr.containerHeight}</span>
          <span>1000</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={1000}
          value={[cmbr.containerHeight]}
          onValueChange={([v]) => cmbr.set((o) => ({ ...o, containerHeight: v! }))}
        />
      </div>
    </div>
  )
}
