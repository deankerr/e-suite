'use client'

import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { Slider as RxSlider } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { forwardRef } from 'react'
import { NumberInputAtom } from '../threads/useThread'

type SliderProps = {
  inputAtom: NumberInputAtom
} & React.ComponentProps<typeof RxSlider>

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { inputAtom, className, ...props },
  forwardedRef,
) {
  const { atom, label, initialValue, ...sliderProps } = inputAtom
  const [value, setValue] = useAtom(atom)

  return (
    <div className={cn('flex flex-col gap-1.5 p-3', className)} ref={forwardedRef}>
      <div className="flex items-center justify-between">
        <Label htmlFor={inputAtom.name}>{label}</Label>
        <div className="text-sm">{value}</div>
      </div>
      <RxSlider
        {...props}
        {...sliderProps}
        value={[value]}
        onValueChange={([v]) => setValue(v ?? initialValue)}
        className="cursor-pointer"
      />
    </div>
  )
})
