import { ImageModel } from '@/convex/types'
import * as Label from '@radix-ui/react-label'
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Select,
  Separator,
  Skeleton,
  Slider,
  Text,
  TextField,
} from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { ImageModelCard } from '../components/ImageModelCard'

type GenerationParamsProps = {
  imageModel?: ImageModel
}

export const GenerationParams = ({ imageModel }: GenerationParamsProps) => {
  return (
    <>
      <div className="space-y-4 px-4">
        <ImageModelCard imageModel={imageModel} />
      </div>

      <Separator size="4" className="mx-2" />
      <div className="flex flex-col gap-3 px-4">
        <SelectInputDemo
          items={['Portrait (512x768)', 'Landscape (768x512)', 'Sqaure (512x512)']}
        />

        <div className="">
          <Label.Root className="text-sm">Batch size</Label.Root>
          <Slider defaultValue={[25]} size="1" className="mt-2" />
        </div>

        <div className="flex flex-col justify-center gap-1">
          <Label.Root className="text-sm">Seed</Label.Root>
          <TextField.Input size="2" placeholder="123456" />
        </div>
      </div>
      <Separator size="4" className="mx-2" />

      <div className="flex flex-col gap-3 px-4">
        <SelectInputDemo items={['Sampler', '2M KK.Slider', 'IDKFA SDM']} />

        <div className="">
          <Label.Root className="text-sm">Steps</Label.Root>
          <Slider defaultValue={[75]} size="1" className="mt-2" />
        </div>

        <div className="">
          <Label.Root className="text-sm">CFG Scale</Label.Root>
          <Slider defaultValue={[46]} size="1" className="mt-2" />
        </div>
      </div>
      <Separator size="4" className="mx-2" />

      <div className="flex flex-col gap-3 px-4">
        <Label.Root className="text-sm">LoRA</Label.Root>
        <div className="flex justify-between gap-2">
          <Button variant="outline" className="grow">
            Good Personalities v0.3
          </Button>
          <IconButton variant="surface">0.7</IconButton>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" className="grow">
            Party Balloons v4
          </Button>
          <IconButton variant="surface">0.5</IconButton>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" className="grow">
            Hands Are Cheeses
          </Button>
          <IconButton variant="surface">0.3</IconButton>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" className="grow">
            No Birds v1.4
          </Button>
          <IconButton variant="surface">0.5</IconButton>
        </div>
      </div>
    </>
  )
}

type SelectInputDemoProps = {
  className?: TailwindClass
  items?: string[]
  label?: string
}

const SelectInputDemo = ({ className, items = ['Select'] }: SelectInputDemoProps) => {
  return (
    <Select.Root defaultValue={items[0]}>
      <Select.Trigger className={className} />
      <Select.Content>
        <Select.Group>
          <Select.Label>Resolutions</Select.Label>
          {items.map((item, i) => (
            <Select.Item key={i} value={item}>
              {item}
            </Select.Item>
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="potato">Potato</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}
