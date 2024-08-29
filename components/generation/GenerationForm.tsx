'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label as LabelPrimitive } from '@radix-ui/react-label'
import { RadioCards } from '@radix-ui/themes'
import { nanoid } from 'nanoid/non-secure'
import Image from 'next/image'

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
import { defaultImageModelInputs } from '@/convex/shared/defaults'
import { imageModels } from '@/convex/shared/imageModels'
import { twx } from '@/lib/utils'

import type { ThreadActions } from '@/lib/api'

const Label = twx(LabelPrimitive)`text-sm font-medium block`

const Lora = ({
  value,
  onValueChange,
  onRemove = () => {},
}: {
  value: { id: string; path: string; scale: number }
  onValueChange: (value: { id: string; path: string; scale: number }) => void
  onRemove?: () => void
}) => {
  const [path, setPath] = useState(value.path)
  const [scale, setScale] = useState(value.scale)

  return (
    <div className="flex rounded border border-gray-4">
      <div className="grow space-y-2 p-2 pr-0">
        <Label className="text-sm font-medium">
          Path
          <TextField
            value={path}
            onValueChange={(v) => {
              setPath(v)
              onValueChange({ id: value.id, path: v, scale: value.scale })
            }}
          />
        </Label>
        <Label>
          Scale
          <SliderWithInput
            label="Scale"
            min={0}
            max={1}
            step={0.01}
            value={scale}
            onValueChange={(v) => {
              setScale(v)
              onValueChange({ id: value.id, path: value.path, scale: v })
            }}
          />
        </Label>
      </div>

      <div className="flex-col-center shrink-0 p-1">
        <IconButton variant="ghost" aria-label="Remove" className="" onClick={onRemove}>
          <Icons.X size={18} />
        </IconButton>
      </div>
    </div>
  )
}

export const GenerationForm = (props: { onRun?: ThreadActions['run']; loading?: boolean }) => {
  const [modelId, setModelId] = useState(imageModels[0]?.modelId ?? '')
  const model = imageModels.find((model) => model.modelId === modelId)
  const inputs = model?.inputs ?? defaultImageModelInputs

  const [loras, setLoras] = useState<{ id: string; path: string; scale: number }[]>([])

  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState('square')

  const [inputsContainer] = useAutoAnimate()
  const [lorasContainer] = useAutoAnimate()

  const run = () => {
    if (!props.onRun) {
      console.error('No run function provided')
      return
    }

    props.onRun({
      runConfig: {
        type: 'textToImage' as const,
        modelId,
        loras: loras.map((lora) => ({
          path: lora.path,
          scale: lora.scale,
        })),
        prompt,
        negativePrompt,
        n: quantity,
        seed,
        size: dimensions as 'portrait' | 'square' | 'landscape',
      },
    })
  }

  return (
    <div className="space-y-4 overflow-hidden py-2">
      <div ref={inputsContainer} className="space-y-3 overflow-hidden px-2">
        <Label htmlFor="model">Model</Label>
        <Select value={modelId} onValueChange={setModelId}>
          <SelectTrigger id="model" className="h-auto max-w-full whitespace-normal text-left">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent className="max-w-80">
            {imageModels.map((model) => (
              <SelectItem key={model.modelId} value={model.modelId}>
                <div className="flex gap-2">
                  <div className="h-16 w-16 shrink-0">
                    <Image
                      src={model.coverImage}
                      alt={model.name}
                      fill
                      className="object-cover"
                      sizes="4rem"
                    />
                  </div>

                  <div className="grow">
                    <p className="font-medium">{model.name}</p>
                    <p className="text-xs text-gray-11" data-description>
                      {model.description}
                    </p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {inputs.loras && (
          <div className="space-y-2 text-sm font-medium">
            <div className="flex-between">
              LoRAs
              <Button
                variant="surface"
                size="1"
                onClick={() => setLoras((prev) => [...prev, { id: nanoid(), path: '', scale: 1 }])}
                className="-mb-1"
              >
                Add
              </Button>
            </div>
            <div ref={lorasContainer} className="space-y-2">
              {loras.map((lora) => (
                <Lora
                  key={lora.id}
                  value={lora}
                  onValueChange={(v) => {
                    setLoras((prev) => prev.map((lora) => (lora.id === v.id ? v : lora)))
                  }}
                  onRemove={() => setLoras((prev) => prev.filter(({ id }) => id !== lora.id))}
                />
              ))}
            </div>
          </div>
        )}

        <Label>
          Prompt
          <TextareaAutosize value={prompt} onValueChange={setPrompt} />
        </Label>

        {inputs.negativePrompt && (
          <Label>
            Negative Prompt
            <TextareaAutosize value={negativePrompt} onValueChange={setNegativePrompt} />
          </Label>
        )}

        <div>
          <Label>Dimensions</Label>
          <RadioCards.Root columns="3" gap="2" value={dimensions} onValueChange={setDimensions}>
            <RadioCards.Item
              value="portrait"
              className="flex-col gap-1"
              disabled={!inputs.sizes.some((size) => size.name === 'portrait')}
            >
              <RectangleVertical className="text-gray-11" />
              <p>Portrait</p>
              <p className="text-xs text-gray-11">832x1216</p>
            </RadioCards.Item>
            <RadioCards.Item
              value="square"
              className="flex-col gap-1"
              disabled={!inputs.sizes.some((size) => size.name === 'square')}
            >
              <Icons.Square size={24} className="text-gray-11" />
              <p>Square</p>
              <p className="text-xs text-gray-11">1024x1024</p>
            </RadioCards.Item>
            <RadioCards.Item
              value="landscape"
              className="flex-col gap-1"
              disabled={!inputs.sizes.some((size) => size.name === 'landscape')}
            >
              <RectangleHorizontal className="text-gray-11" />
              <p>Landscape</p>
              <p className="text-xs text-gray-11">1216x832</p>
            </RadioCards.Item>
          </RadioCards.Root>
        </div>

        <div className="flex-between">
          <Label htmlFor="quantity">Quantity</Label>
          <TextField
            id="quantity"
            type="number"
            className="w-16"
            min={1}
            max={inputs.maxQuantity ?? 4}
            value={Math.min(quantity, inputs.maxQuantity ?? 4)}
            onValueChange={(value) => setQuantity(Number(value))}
          />
        </div>

        <div className="flex-between">
          <Label htmlFor="seed">Seed</Label>
          <TextField
            id="seed"
            type="number"
            value={seed}
            onValueChange={(value) => setSeed(Number(value))}
            placeholder="random"
          />
        </div>
      </div>

      <div className="flex justify-end px-2">
        <Button variant="surface" loading={props.loading} onClick={run} disabled={!props.onRun}>
          Run
        </Button>
      </div>
    </div>
  )
}
