'use client'

import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { Slider as RxSlider } from '@radix-ui/themes'
import { forwardRef, useEffect } from 'react'
import { NumberInputData, useThreadsAtom } from '../threads/threads.store'

type SliderProps = {
  label: string
  paramValue: NumberInputData
} & Omit<React.ComponentProps<typeof RxSlider>, 'defaultValue'>

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { label, name, paramValue, className, ...props },
  forwardedRef,
) {
  const [atomValue, setAtomValue] = useThreadsAtom(paramValue)
  const { defaultValue, ...sliderProps } = paramValue

  useEffect(() => console.log('render slider', name))
  return (
    <div className={cn('flex flex-col gap-1.5 p-3', className)} ref={forwardedRef}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        <div className="text-sm">{atomValue}</div>
      </div>
      <RxSlider
        {...props}
        {...sliderProps}
        name={name}
        value={[atomValue as number]}
        onValueChange={([v]) => setAtomValue(v ?? defaultValue)}
        className="cursor-pointer"
      />
    </div>
  )
})
