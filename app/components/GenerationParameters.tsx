import { api } from '@/convex/_generated/api'
import { ImageModel } from '@/convex/types'
import * as Label from '@radix-ui/react-label'
import { Button, Heading, ScrollArea, Select, Slider, TextArea, TextField } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useState } from 'react'

type GenerationParamsProps = {
  imageModel?: ImageModel
}

export const GenerationParameters = ({ imageModel }: GenerationParamsProps) => {
  const controlCn = 'flex flex-col gap-1'
  const labelCn = 'text-xs font-medium'

  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [dimensions, setDimensions] = useState('512x768')
  const [numImages, setNumImages] = useState(4)
  const [scheduler, setScheduler] = useState<string>(sinkinSchedulers[0][0])
  const [seed, setSeed] = useState('')
  const [steps, setSteps] = useState<[number]>([30])
  const [guidance, setGuidance] = useState<[number]>([7.5])

  const create = useMutation(api.generations.create)

  const handleClick = async () => {
    if (!imageModel) return console.error('no imageModel set')
    const [width, height] = dimensions.split('x')
    try {
      const result = await create({
        imageModelId: imageModel._id,
        imageModelProviderId: imageModel.sinkinProviderId!,
        prompt,
        negativePrompt,
        width: Number(width),
        height: Number(height),
        n: numImages,
        scheduler,
        guidance: Number(guidance[0]),
        steps: Number(steps[0]),
        lcm: false,
      })
      console.log('result', result)
    } catch (err) {
      console.error(err)
    }
  }

  if (!imageModel) return null
  return (
    <>
      <div className="hidden font-code text-[8px] text-gold-8">
        {'<GenerationParams>'} imageModel._id:{imageModel?._id}
      </div>

      <div className="flex p-4">
        <Button variant="surface" className="w-full" onClick={() => void handleClick()}>
          Generate
        </Button>
      </div>

      <Heading size="2">Parameters</Heading>
      <ScrollArea>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 px-3 py-1">
          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="prompt">
              Prompt
            </Label.Root>
            <TextArea name="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="negative_prompt">
              Negative prompt
            </Label.Root>
            <TextArea
              name="negative_prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label.Root className={labelCn} htmlFor="dimensions">
              Dimensions
            </Label.Root>
            <Select.Root name="dimensions" value={dimensions} onValueChange={setDimensions}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="512x768">Portrait (512px x 768px)</Select.Item>
                <Select.Item value="512x512">Square (512px x 512px)</Select.Item>
                <Select.Item value="768x512">Landscape (768px x 512px)</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="num_images">
              Batch size
            </Label.Root>
            <TextField.Input value={numImages} name="num_images" disabled />
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="seed">
              Seed
            </Label.Root>
            <TextField.Input
              size="2"
              name="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="scheduler">
              Scheduler
            </Label.Root>
            <Select.Root name="scheduler" value={scheduler} onValueChange={setScheduler}>
              <Select.Trigger />
              <Select.Content>
                {sinkinSchedulers.map(([value]) => (
                  <Select.Item key={value} value={value}>
                    {value}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="steps">
              Steps
            </Label.Root>
            <Slider
              min={1}
              max={50}
              name="steps"
              value={steps}
              onValueChange={([v]) => setSteps([v!])}
            />
          </div>

          <div className={controlCn}>
            <Label.Root className={labelCn} htmlFor="scale">
              Guidance scale
            </Label.Root>
            <Slider
              min={1}
              max={20}
              step={0.5}
              name="scale"
              value={guidance}
              onValueChange={([v]) => setGuidance([v!])}
            />
          </div>
        </form>
      </ScrollArea>
    </>
  )
}

const sinkinSchedulers = [
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
