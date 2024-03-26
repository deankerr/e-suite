import React, { forwardRef } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Button } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const toggleGroupItemClasses =
  'data-[state=on]:bg-accent-3 rounded-none first:rounded-l last:rounded-r'

type Props = React.ComponentProps<typeof ToggleGroup.Root>

export const DimensionsToggle = forwardRef<HTMLDivElement, Props>(function DimensionsToggle(
  { className, ...props },
  ref,
) {
  return (
    <ToggleGroup.Root
      ref={ref}
      className={cn('grid grid-cols-3 gap-1', className)}
      aria-label="Generate Image Dimensions"
      {...props}
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
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value="square"
        aria-label="Square"
        asChild
      >
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
})
