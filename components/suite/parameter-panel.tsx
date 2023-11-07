import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { EngineInputControls } from '../chat/form/engine-input-controls'
import { Button } from '../ui/button'

export function ParameterPanel({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('space-y-6 overflow-y-auto p-6', className)}>
      <ParamPresetSelectDemo />
      <EngineInputControls />
    </div>
  )
}

function ParamPresetSelectDemo() {
  //
  return (
    <div className="flex justify-between gap-1">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt">Preset 1</SelectItem>
          <SelectItem value="cllama">Llama</SelectItem>
          <SelectItem value="orca">Alpaca</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">Save</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Delete</Button>
    </div>
  )
}
