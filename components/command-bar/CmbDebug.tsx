import { Button, Checkbox, Slider } from '@radix-ui/themes'

import { useCmbLayoutAtom } from '@/components/command-bar/alphaAtoms'
import { cn } from '@/lib/utils'

type CmbDebugProps = { props?: unknown }

const HIDE = false

export const CmbDebug = ({}: CmbDebugProps) => {
  const [{ containerHeightPc, panelHeight, panelOpen, rounded }, set] = useCmbLayoutAtom()

  return (
    <div
      className={cn(
        'fixed left-1/2 top-0 flex -translate-x-1/2 gap-2 bg-bronze-2 p-2 font-mono text-xs',
        HIDE && 'hidden',
      )}
    >
      <div className="grid gap-1">
        <Button
          variant="surface"
          className="font-mono"
          size="1"
          onClick={() => set((v) => ({ ...v, panelOpen: !panelOpen }))}
        >
          {panelOpen ? 'open' : 'closed'}
        </Button>

        <div>
          <Checkbox
            checked={rounded}
            onCheckedChange={() => set((o) => ({ ...o, rounded: !rounded }))}
          />
          rounded
        </div>
      </div>
      <div className="w-40">
        <div>panel height</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{panelHeight}</span>
          <span>1000</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={1000}
          value={[panelHeight]}
          onValueChange={([v]) => set((o) => ({ ...o, panelHeight: v ?? 512 }))}
        />
      </div>

      <div className="w-40">
        <div>container height %</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{containerHeightPc}</span>
          <span>100%</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={100}
          value={[containerHeightPc]}
          onValueChange={([v]) => set((o) => ({ ...o, containerHeightPc: v ?? 85 }))}
        />
      </div>
    </div>
  )
}
