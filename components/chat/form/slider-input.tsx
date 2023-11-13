import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function SliderInput({
  value,
  onChange,
  range,
}: {
  value: number
  onChange: (value: number) => void
  range: Record<'min' | 'max' | 'step' | 'default', number>
}) {
  return (
    <div className="flex w-full space-x-1">
      <Slider
        {...range}
        defaultValue={[value ?? 0]}
        onValueCommit={([newValue]) => {
          onChange(newValue ?? range.default)
          console.log('i commit')
        }}
      />
      <Input
        {...range}
        className="w-20 px-1 text-right font-mono"
        type="number"
        value={value}
        onChange={(e) => {
          console.log('input change')
          onChange(Number(e.target.value))
        }}
      />
    </div>
  )
}
