import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function SliderInput({
  field,
  range,
  setEnabled,
}: {
  field: { value: number; onChange: (newValue: unknown) => void }
  range: Record<'min' | 'max' | 'step', number>
  setEnabled: () => void
}) {
  const { value, onChange, ...rest } = field

  return (
    <div className="flex w-full space-x-1">
      <Slider
        {...range}
        value={[value]}
        onValueChange={([newValue]) => {
          setEnabled()
          onChange(newValue)
        }}
      />
      <Input
        {...range}
        className="w-20 px-1 text-right font-mono"
        type="number"
        value={value}
        onChange={(e) => {
          setEnabled()
          onChange(e.target.value)
        }}
        {...rest}
      />
    </div>
  )
}
