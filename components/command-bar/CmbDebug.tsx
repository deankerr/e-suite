import { Button, Slider } from '@radix-ui/themes'
import { useAtom } from 'jotai'

import { cmbHeightAtom, cmbOpenAtom, cmbTotalHeightAtom } from '@/components/command-bar/alphaAtoms'
import { cn } from '@/lib/utils'

type CmbDebugProps = { props?: unknown }

const HIDE = false

export const CmbDebug = ({}: CmbDebugProps) => {
  const [cmbOpen, setCmbOpen] = useAtom(cmbOpenAtom)
  const [cmbHeight, setCmbHeight] = useAtom(cmbHeightAtom)
  const [cmbTotalHeight, setCmbTotalHeight] = useAtom(cmbTotalHeightAtom)

  return (
    <div
      className={cn(
        'fixed left-1/2 top-0 flex -translate-x-1/2 gap-2 bg-bronze-2 p-2 font-mono text-xs',
        HIDE && 'hidden',
      )}
    >
      <Button variant="surface" onClick={() => setCmbOpen(!cmbOpen)}>
        {cmbOpen ? 'open' : 'closed'}
      </Button>
      <div className="w-60">
        <div>tpl height</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{cmbHeight}</span>
          <span>1000</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={1000}
          value={[cmbHeight]}
          onValueChange={([v]) => setCmbHeight(v ?? 400)}
        />
      </div>

      <div className="w-60">
        <div>total height</div>
        <div className="w-full flex-between">
          <span>0</span>
          <span>{cmbTotalHeight}</span>
          <span>100%</span>
        </div>
        <Slider
          size="1"
          min={0}
          max={100}
          value={[cmbTotalHeight]}
          onValueChange={([v]) => setCmbTotalHeight(v ?? 75)}
        />
      </div>
    </div>
  )
}
