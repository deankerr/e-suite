import { Button, Checkbox, IconButton, Slider } from '@radix-ui/themes'

import { useCommandBar } from '@/components/command-bar/atoms'
import { cn } from '@/lib/utils'

export const CommandBarDebug = () => {
  const cmbr = useCommandBar()

  return (
    <div
      className={cn(
        'fixed right-2 top-1/4 grid gap-2 rounded-xl bg-bronze-2 p-2 font-mono text-xs',
        'translate-x-3/4 opacity-20 transition-transform hover:translate-x-0 hover:opacity-100',
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

      <div className="flex gap-2">
        <div className="flex-center">panelIndex: {cmbr.panelIndex}</div>
        <IconButton
          variant="surface"
          size="1"
          onClick={() => cmbr.set((o) => ({ ...o, panelIndex: o.panelIndex - 1 }))}
        >
          ←
        </IconButton>
        <IconButton
          variant="surface"
          size="1"
          onClick={() => cmbr.set((o) => ({ ...o, panelIndex: o.panelIndex + 1 }))}
        >
          →
        </IconButton>
      </div>

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

      <div className="w-40">
        <div>container width</div>
        <div className="flex-between">
          <Button
            variant="surface"
            size="1"
            className="font-mono"
            color={cmbr.containerWidth === 320 ? 'grass' : undefined}
            onClick={() => cmbr.set((o) => ({ ...o, containerWidth: 320 }))}
          >
            320
          </Button>
          <Button
            variant="surface"
            size="1"
            className="font-mono"
            color={cmbr.containerWidth === 360 ? 'grass' : undefined}
            onClick={() => cmbr.set((o) => ({ ...o, containerWidth: 360 }))}
          >
            360
          </Button>
          <Button
            variant="surface"
            size="1"
            className="font-mono"
            color={cmbr.containerWidth === 768 ? 'grass' : undefined}
            onClick={() => cmbr.set((o) => ({ ...o, containerWidth: 768 }))}
          >
            768
          </Button>
          <Button
            variant="surface"
            size="1"
            className="font-mono"
            color={cmbr.containerWidth === 1200 ? 'grass' : undefined}
            onClick={() => cmbr.set((o) => ({ ...o, containerWidth: 1200 }))}
          >
            big
          </Button>
        </div>
      </div>
    </div>
  )
}
