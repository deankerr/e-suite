'use client'

import { Model } from '@/data/types'
import { Button, Popover } from '@radix-ui/themes'
import { ModelFilterableList } from './ModelFilterableList'

type ModelSelectBoxProps = {
  models: Model[]
}

export const ModelSelectBox = async ({ models }: ModelSelectBoxProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" highContrast>
          Select Model
        </Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: 360 }} align="center">
        <ModelFilterableList items={models} />
      </Popover.Content>
    </Popover.Root>
  )
}
