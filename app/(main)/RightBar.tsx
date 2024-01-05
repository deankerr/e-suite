'use client'

import { SidebarToggleDemo } from '@/components/ui/SidebarToggle'
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
  Slider,
  Text,
  TextField,
} from '@radix-ui/themes'

type RightBarProps = {
  props?: any
}

export const RightBar = ({ props }: RightBarProps) => {
  return (
    <div className="right-sidebar relative -right-80 h-full w-80 place-self-end overflow-y-auto overflow-x-hidden border-l border-gray-6 bg-background pt-2 transition-all duration-300 md:right-3">
      <div className="flex flex-col justify-center gap-5 py-2">
        <div className="space-y-4">
          {/* asChild combobox? */}
          <Card className="mx-auto w-60">
            <Flex gap="3" align="center">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback="T"
              />
              <Box>
                <Text as="div" size="2" weight="bold">
                  Stable Diffusion 1.5
                </Text>
                <Text as="div" size="2" color="gray">
                  Together.ai
                </Text>
              </Box>
            </Flex>
          </Card>

          <Card className="mx-auto w-60">
            <Flex gap="3" align="center">
              <Avatar
                size="3"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback="T"
              />
              <Box>
                <Text as="div" size="2" weight="bold">
                  Realistic Visions 6.0
                </Text>
                <Text as="div" size="2" color="gray">
                  Together.ai
                </Text>
              </Box>
            </Flex>
          </Card>
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
      </div>
    </div>
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
