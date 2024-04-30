import { Button, Checkbox, TextField } from '@radix-ui/themes'

import { Label } from '../ui/Label'
import { DimensionsRadioCards } from './DimensionsRadioCards'
import { ModelTile } from './ModelTile'
import { Textarea } from './Textarea'

type GenerationInputCardProps = { props?: unknown }

export const GenerationInputCard = ({}: GenerationInputCardProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-0.5">
        <Label className="font-mono">prompt</Label>
        <Textarea rows={3} />
      </div>

      <div className="grid gap-0.5">
        <div className="flex justify-between font-mono">
          <Label>negative prompt</Label>
          <div className="flex items-end gap-2">
            <Checkbox defaultChecked /> <Label>use default</Label>
          </div>
        </div>
        <Textarea rows={3} />
      </div>

      {/* settings grid */}
      <div className="flex justify-between">
        <ModelTile model="pixart" />

        {/* dimensions */}
        <div className="grid gap-2">
          <DimensionsRadioCards />

          <div className="gap-2 flex-start">
            <div className="grid gap-0.5">
              <Label className="font-mono">seed</Label>
              <TextField.Root type="number" className="w-28" />
            </div>

            <div className="grid gap-0.5">
              <Label className="font-mono">guidance scale</Label>
              <TextField.Root type="number" className="w-28" />
            </div>
          </div>
        </div>

        <div className="grid items-end gap-4">
          <div></div>
          <Button variant="surface" size="4">
            Start
          </Button>
        </div>
      </div>
    </div>
  )
}
