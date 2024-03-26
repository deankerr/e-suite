import { ComponentProps } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { MenuIcon, Volume2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

type RxColor = ComponentProps<typeof Button>['color']
const warmColors = [
  'gray',
  'gold',
  'bronze',
  'brown',
  'yellow',
  'amber',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
] as const

const variants = ['solid', 'surface', 'outline', 'soft', 'ghost'] as const

type ButtonColorDemoProps = {} & React.ComponentProps<'div'>

export const ButtonColorDemo = ({ className, ...props }: ButtonColorDemoProps) => {
  return (
    <div {...props} className={cn('flex-col-center gap-6', className)}>
      {warmColors.map((color) => (
        <ButtonSwatch key={color} color={color} />
      ))}
    </div>
  )
}

const ButtonSwatch = (props: { color: RxColor }) => {
  const { color } = props
  const size = '3'

  return (
    <div className="flex-center gap-5">
      {variants.map((v) => (
        <Button key={v} variant={v} size={size} color={color}>
          Generate
        </Button>
      ))}
      {variants.map((v) => (
        <Button key={v} variant={v} size={size} color={color} highContrast>
          Generate
        </Button>
      ))}
    </div>
  )
}

type IconButtonColorDemoProps = {} & React.ComponentProps<'div'>

export const IconButtonColorDemo = ({ className, ...props }: IconButtonColorDemoProps) => {
  return (
    <div {...props} className={cn('flex-col-center gap-3', className)}>
      {warmColors.map((color) => (
        <div key={color} className="flex-center gap-3">
          <IconButtonSwatch color={color} Icon={<MenuIcon />} />
          <IconButtonSwatch color={color} Icon={<Volume2Icon />} />
        </div>
      ))}
    </div>
  )
}

type IconButtonSwatchProps = {
  Icon: React.ReactElement
  color: RxColor
} & React.ComponentProps<'div'>

export const IconButtonSwatch = ({ Icon, color, className, ...props }: IconButtonSwatchProps) => {
  const size = '3'
  return (
    <div {...props} className={cn('flex-center gap-5', className)}>
      {variants.map((v) => (
        <IconButton key={v} variant={v} color={color} size={size}>
          {Icon}
        </IconButton>
      ))}
      {variants.map((v) => (
        <IconButton key={v + 'h'} variant={v} color={color} size="3" highContrast>
          {Icon}
        </IconButton>
      ))}
    </div>
  )
}
