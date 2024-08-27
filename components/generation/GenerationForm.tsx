'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label as LabelPrimitive } from '@radix-ui/react-label'
import { RadioCards, SegmentedControl } from '@radix-ui/themes'
import { nanoid } from 'nanoid/non-secure'

import { RectangleHorizontal } from '@/components/icons/RectangleHorizontal'
import { RectangleVertical } from '@/components/icons/RectangleVertical'
import { Button, IconButton } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { SliderWithInput } from '@/components/ui/SliderWithInput'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { TextField } from '@/components/ui/TextField'
import { twx } from '@/lib/utils'
import Models from './models.json'

const Label = twx(LabelPrimitive)`text-sm font-medium block`

const Lora = ({
  value,
  onRemove = () => {},
}: {
  value: { id: string; path: string; scale: number }
  onValueChange: (value: { id: string; path: string; scale: number }) => void
  onRemove?: () => void
}) => {
  const [path, setPath] = useState(value.path)
  const [scale, setScale] = useState(value.scale)

  return (
    <div className="space-y-2 rounded border border-gray-4 p-2">
      <IconButton
        variant="ghost"
        aria-label="Remove"
        className="absolute right-0.5 top-0.5 z-10"
        onClick={onRemove}
      >
        <Icons.X size={18} />
      </IconButton>

      <Label className="text-sm font-medium">
        Path
        <TextField size="3" value={path} onValueChange={setPath} />
      </Label>
      <Label>
        Scale
        <SliderWithInput
          label="Scale"
          min={0}
          max={1}
          step={0.01}
          value={scale}
          onValueChange={setScale}
        />
      </Label>
    </div>
  )
}

export const GenerationForm = () => {
  const [loras, setLoras] = useState<{ id: string; path: string; scale: number }[]>([])
  const [lorasContainer] = useAutoAnimate()

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-3 px-2">
        <Label>
          Model
          <Select defaultValue={Models[0]?.model_id ?? ''}>
            <SelectTrigger className="items-start [&_[data-description]]:hidden">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent className="max-w-[96vw]">
              {Models.map((model) => (
                <SelectItem key={model.model_id} value={model.model_id}>
                  <p className="font-medium">{model.name}</p>
                  <p className="truncate text-sm text-gray-11" data-description>
                    {model.description}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>

        <div className="space-y-2 text-sm font-medium">
          <div className="flex-between">
            LoRAs
            <Button
              variant="surface"
              size="1"
              onClick={() => setLoras((prev) => [...prev, { id: nanoid(), path: '', scale: 0.75 }])}
            >
              Add
            </Button>
          </div>
          <div ref={lorasContainer} className="space-y-2">
            {loras.map((lora) => (
              <Lora
                key={lora.id}
                value={lora}
                onValueChange={() => {}}
                onRemove={() => setLoras((prev) => prev.filter(({ id }) => id !== lora.id))}
              />
            ))}
          </div>
        </div>

        <Label>
          Prompt
          <TextareaAutosize />
        </Label>

        <Label>
          Negative Prompt
          <TextareaAutosize />
        </Label>

        <Label>
          Dimensions
          <RadioCards.Root columns="3" gap="2">
            <RadioCards.Item value="portrait" className="flex-col gap-1">
              <RectangleVertical className="text-gray-11" />
              <p>Portrait</p>
              <p className="text-xs text-gray-11">832x1216</p>
            </RadioCards.Item>
            <RadioCards.Item value="square" className="flex-col gap-1">
              <Icons.Square size={24} className="text-gray-11" />
              <p>Square</p>
              <p className="text-xs text-gray-11">1024x1024</p>
            </RadioCards.Item>
            <RadioCards.Item value="landscape" className="flex-col gap-1">
              <RectangleHorizontal className="text-gray-11" />
              <p>Landscape</p>
              <p className="text-xs text-gray-11">1216x832</p>
            </RadioCards.Item>
          </RadioCards.Root>
        </Label>

        <Label>
          Quantity
          <div className="mx-auto max-w-52">
            <SegmentedControl.Root className="grid" size="3">
              <SegmentedControl.Item value="1">1</SegmentedControl.Item>
              <SegmentedControl.Item value="2">2</SegmentedControl.Item>
              <SegmentedControl.Item value="3">3</SegmentedControl.Item>
              <SegmentedControl.Item value="4">4</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
        </Label>

        <Label>
          Seed
          <TextField type="number" size="3" />
        </Label>
      </div>

      <div className="flex justify-end px-2">
        <Button variant="surface">Run</Button>
      </div>
    </div>
  )
}
