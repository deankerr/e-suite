'use client'

import dynamic from 'next/dynamic'

import { cn } from '@/lib/utils'

const CanvasEffect = dynamic(() => import('@/components/canvas/CanvasRevealEffect'))

type CanvasGoldSparklesProps = { props?: unknown } & React.ComponentProps<'div'>

export const GoldSparklesEffect = ({ className, ...props }: CanvasGoldSparklesProps) => {
  return (
    <CanvasEffect
      animationSpeed={5}
      colors={[[151, 131, 101]]}
      opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
      dotSize={2}
      maxFps={60}
      showGradient={false}
      {...props}
      className={cn('absolute inset-0', className)}
    />
  )
}
