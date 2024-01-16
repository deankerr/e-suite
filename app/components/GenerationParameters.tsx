import { ImageModel } from '@/convex/types'
import * as Label from '@radix-ui/react-label'
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Select,
  Separator,
  Skeleton,
  Slider,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes'

type GenerationParamsProps = {
  imageModel?: ImageModel
}

export const GenerationParameters = ({ imageModel }: GenerationParamsProps) => {
  if (!imageModel) return null
  const controlCn = 'flex flex-col gap-1'
  return (
    <>
      <div className="hidden font-code text-[8px] text-gold-8">
        {'<GenerationParams>'} imageModel._id:{imageModel?._id}
      </div>

      <div className="flex p-4">
        <Button variant="soft" className="w-full">
          Generate
        </Button>
      </div>

      <Heading size="2">Parameters</Heading>
      <ScrollArea>
        <form onSubmit={(e) => {}} className="flex flex-col gap-3 px-3 py-1">
          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="prompt">
              Prompt
            </Label.Root>
            <TextArea name="prompt" />
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="negative_prompt">
              Negative prompt
            </Label.Root>
            <TextArea name="negative_prompt" />
          </div>

          <div className="flex flex-col">
            <Label.Root className="text-sm" htmlFor="dimensions">
              Dimensions
            </Label.Root>
            <Select.Root defaultValue="portrait" name="dimensions">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="portrait">Portrait (512px x 768px)</Select.Item>
                <Select.Item value="square">Square (512px x 512px)</Select.Item>
                <Select.Item value="landscape">Landscape (768px x 512px)</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="num_images">
              Batch size
            </Label.Root>
            <TextField.Input value={4} name="num_images" disabled />
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="seed">
              Seed
            </Label.Root>
            <TextField.Input size="2" placeholder="123456" name="seed" />
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="sampler">
              Sampler
            </Label.Root>
            <Select.Root name="sampler">
              <Select.Trigger />
              <Select.Content>
                {sinkinSamplers.map(([value]) => (
                  <Select.Item key={value} value={value}>
                    {value}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="steps">
              Steps
            </Label.Root>
            <Slider min={1} max={50} defaultValue={[30]} name="steps" className="" />
          </div>

          <div className={controlCn}>
            <Label.Root className="text-sm" htmlFor="scale">
              Guidance scale
            </Label.Root>
            <Slider min={1} max={20} step={0.5} defaultValue={[7.5]} name="scale" className="" />
          </div>
        </form>
      </ScrollArea>
    </>
  )
}

const sinkinSamplers = [
  ['DPMSolverMultistep'],
  ['K_EULER_ANCESTRAL'],
  ['DDIM'],
  ['K_EULER'],
  ['PNDM'],
  ['KLMS'],
] as const

{
  /* <div className="flex flex-col gap-3 px-4">
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
      </div> */
}
