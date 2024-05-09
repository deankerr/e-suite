import { Code } from '@radix-ui/themes'
import { RectangleHorizontalIcon, RectangleVerticalIcon, SquareIcon } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

const SizeButton = (props: { icon: LucideIcon; label: string; pixels: string }) => {
  return (
    <div className="h-24 w-28 gap-1 rounded border flex-col-center">
      <props.icon />
      <div className="font-sans font-medium">{props.label}</div>
      <Code color="gray">{props.pixels}</Code>
    </div>
  )
}

export const SizeButtons = () => (
  <div className="flex gap-2">
    <SizeButton label="Portrait" pixels="512x768" icon={RectangleVerticalIcon} />
    <SizeButton label="Portrait 16:9" pixels="768x1024" icon={RectangleVerticalIcon} />
    <SizeButton label="Landscape" pixels="768x512" icon={RectangleHorizontalIcon} />
    <SizeButton label="Landscape 16:9" pixels="1024x768" icon={RectangleHorizontalIcon} />
    <SizeButton label="Square" pixels="512x512" icon={SquareIcon} />
    <SizeButton label="Square HD" pixels="1024x1024" icon={SquareIcon} />
  </div>
)
