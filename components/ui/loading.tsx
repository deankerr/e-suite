import { cn } from '@/lib/utils'

const icons = {
  spinner: 'daisy-loading-spinner',
  dots: 'daisy-loading-dots',
  ring: 'daisy-loading-ring',
  ball: 'daisy-loading-ball',
  bars: 'daisy-loading-bars',
  infinity: 'daisy-loading-infinity',
} as const

const sizes = {
  xs: 'daisy-loading-xs',
  sm: 'daisy-loading-sm',
  md: 'daisy-loading-md',
  lg: 'daisy-loading-lg',
} as const

type Props = {
  icon?: keyof typeof icons
  size?: keyof typeof sizes
} & React.HTMLAttributes<HTMLSpanElement>

export function Loading({ icon = 'spinner', size = 'md', className, ...props }: Props) {
  return (
    <>
      <span
        className={cn(className, 'daisy-loading align-middle', icons[icon], sizes[size])}
        {...props}
      ></span>
    </>
  )
}
