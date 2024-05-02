import { forwardRef } from 'react'
import { Button, CheckboxCards, SegmentedControl, TextArea, TextField } from '@radix-ui/themes'
import {
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SearchIcon,
  SquareIcon,
} from 'lucide-react'

import { LabelMono } from '@/components/ui/Label'
import { SelectList } from '@/components/ui/SelectList'
import { modelsList } from '@/convex/models'
import { cn } from '@/lib/utils'

const promptDefaultValue =
  'photo of a rhino dressed suit and tie sitting at a table in a bar with a bar stools, award winning photography, Elke vogelsang'
const negPromptDefaultValue = 'cartoon, illustration, animation. face. male, female'

type GenerationInputCardProps = {
  props?: unknown
} & React.ComponentProps<'div'>

export const GenerationInputCard = forwardRef<HTMLDivElement, GenerationInputCardProps>(
  function GenerationInputCard({ className, ...props }, forwardedRef) {
    return (
      <div {...props} className={cn('h-full', className)} ref={forwardedRef}>
        <form className="flex h-full flex-col gap-2">
          <div className="grid gap-0.5">
            <LabelMono htmlFor="prompt">prompt</LabelMono>
            <TextArea name="prompt" size="3" defaultValue={promptDefaultValue} />
          </div>

          <div className="grid gap-0.5">
            <LabelMono htmlFor="negative_prompt">negative_prompt</LabelMono>
            <TextArea name="negative_prompt" size="3" defaultValue={negPromptDefaultValue} />
          </div>

          <div className="flex gap-4 px-2">
            <div className="flex flex-col gap-0.5">
              <LabelMono>model</LabelMono>
              <div className="grow gap-2 border border-dashed border-gray-4 px-2 flex-col-center">
                <TextField.Root size="3" className="w-full" placeholder="Search models">
                  <TextField.Slot>
                    <SearchIcon className="size-4" />
                  </TextField.Slot>
                </TextField.Root>

                <SelectList
                  size="3"
                  items={modelsList.map(({ model_id, provider, name }) => ({
                    label: name,
                    value: `${provider}::${model_id}`,
                  }))}
                />
              </div>
            </div>

            <div className="flex gap-1">
              <div className="grid h-fit gap-0.5">
                <LabelMono>dimensions</LabelMono>
                <CheckboxCards.Root size="1" gap="2" className="w-[154px]">
                  <CheckboxCards.Item value="square" className="h-[48px] w-[154px]">
                    <SquareIcon />
                    Square
                  </CheckboxCards.Item>

                  <CheckboxCards.Item value="portrait_4_3" className="h-[48px] w-[154px]">
                    <RectangleVerticalIcon />
                    Portrait
                  </CheckboxCards.Item>

                  <CheckboxCards.Item value="landscape_4_3" className="h-[48px] w-[154px]">
                    <RectangleHorizontalIcon />
                    Landscape
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
              </div>

              <div className="grid h-fit gap-0.5">
                <LabelMono>hd</LabelMono>
                <CheckboxCards.Root size="1" gap="2" className="w-[80px]">
                  <CheckboxCards.Item value="square_hd" className="h-[48px] w-[80px]">
                    HD
                  </CheckboxCards.Item>

                  <CheckboxCards.Item value="portrait_16_9" className="h-[48px] w-[80px]">
                    16:9
                  </CheckboxCards.Item>

                  <CheckboxCards.Item value="landscape_16_9" className="h-[48px] w-[80px]">
                    16:9
                  </CheckboxCards.Item>
                </CheckboxCards.Root>
              </div>
            </div>

            <div className="flex grow flex-col justify-between gap-2">
              <div className="grid gap-0.5">
                <LabelMono htmlFor="seed">quantity</LabelMono>
                <SegmentedControl.Root defaultValue="2">
                  <SegmentedControl.Item value="1">1</SegmentedControl.Item>
                  <SegmentedControl.Item value="2">2</SegmentedControl.Item>
                  <SegmentedControl.Item value="3">3</SegmentedControl.Item>
                  <SegmentedControl.Item value="4">4</SegmentedControl.Item>
                </SegmentedControl.Root>
              </div>

              <div className="grid gap-0.5">
                <LabelMono htmlFor="seed">seed</LabelMono>
                <TextField.Root name="seed" size="3" type="number" />
              </div>

              <div className="h-[58px] flex-center">
                <Button variant="surface" size="3" className="w-full">
                  Start
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  },
)
