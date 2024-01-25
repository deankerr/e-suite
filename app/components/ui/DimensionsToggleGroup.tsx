import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Button } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'
import React from 'react'

const toggleGroupItemClasses: TailwindClass =
  'data-[state=on]:bg-accent-3 rounded-none first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:outline-none'

export const DimensionsToggleGroup = () => (
  <ToggleGroup.Root
    className="grid grid-cols-3 gap-1"
    type="single"
    defaultValue="center"
    aria-label="Generate Image Dimensions"
  >
    <ToggleGroup.Item
      className={toggleGroupItemClasses}
      value="portrait"
      aria-label="Portrait"
      asChild
    >
      <Button variant="outline" className="h-fit cursor-pointer flex-col py-2" size="1">
        <RectangleVerticalIcon />
        Portrait
      </Button>
    </ToggleGroup.Item>
    <ToggleGroup.Item className={toggleGroupItemClasses} value="square" aria-label="Square" asChild>
      <Button variant="outline" className="h-fit cursor-pointer flex-col py-2" size="1">
        <SquareIcon />
        Square
      </Button>
    </ToggleGroup.Item>
    <ToggleGroup.Item
      className={toggleGroupItemClasses}
      value="landscape"
      aria-label="Landscape"
      asChild
    >
      <Button variant="outline" className="h-fit cursor-pointer flex-col py-2" size="1">
        <RectangleHorizontalIcon />
        Landscape
      </Button>
    </ToggleGroup.Item>
  </ToggleGroup.Root>
)
