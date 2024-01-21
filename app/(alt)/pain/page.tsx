/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { cn } from '@/lib/utils'

export default function AltPage() {
  // AltPage

  return (
    <div className="grid h-dvh">
      <Marquee />
      <Marquee className="font-dot" dir="right" />
      <Marquee className="font-biz" />
    </div>
  )
}

type MarqueeProps = {
  className?: TailwindClass
  dir?: 'left' | 'right'
}

const Marquee = ({ className, dir }: MarqueeProps) => {
  return (
    <marquee
      scrollAmount="50"
      direction={dir}
      className={cn('font-biz text-[10rem] text-accent-9', className)}
    >
      {text()}
    </marquee>
  )
}

const text = () => 'LOADING '.repeat(30)
