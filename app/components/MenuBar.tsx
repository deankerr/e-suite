'use client'

import { Button, DropdownMenu, TextArea } from '@radix-ui/themes'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

type MenuBarProps = {
  props?: unknown
}

export const MenuBar = ({}: MenuBarProps) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ down, movement: [mx, my], offset: [ox, oy] }) => {
    void api.start({
      x: ox,
      y: oy,
      immediate: down,
      onChange: ({ value }) => {
        api.set({
          x: value.x,
          y: value.y,
        })
      },
    })
  })

  const [barOpen, setBarOpen] = useState(false)

  return (
    <animated.div
      className="flex h-fit min-h-24 w-fit min-w-60 touch-manipulation items-center gap-4 border border-gold-8 bg-gold-3 p-2 hover:border-green-8"
      {...bind()}
      style={{ x, y }}
    >
      <div className="h-20 w-8 flex-none rounded bg-gray-7" />
      <Button size="3" color="brown" onClick={() => setBarOpen(!barOpen)}>
        {barOpen ? 'Open' : 'Closed'}
      </Button>
      <DemoTestDropdownMenu />
      {barOpen && <TextArea />}
    </animated.div>
  )
}

const DemoTestDropdownMenu = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="soft">
        Options
        <ChevronDown />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
      <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
          <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

          <DropdownMenu.Separator />
          <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>

      <DropdownMenu.Separator />
      <DropdownMenu.Item>Share</DropdownMenu.Item>
      <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
)
