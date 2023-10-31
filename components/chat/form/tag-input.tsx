import { Input } from '@/components/ui/input'
import { TagBadge } from './tag-badge'

export function TagInput({
  values,
  onChange,
}: {
  values: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <>
      <Input
        placeholder="Add stop sequence..."
        className="ml-1 h-8"
        onKeyDown={(e) => {
          const newValue = e.currentTarget.value
          if (e.key !== 'Enter') return
          e.preventDefault()
          if (values.includes(newValue)) return
          onChange([...values, newValue])
          e.currentTarget.value = ''
        }}
      />
      <div className="col-span-2 space-x-2 space-y-4">
        {values.map((value) => (
          <TagBadge
            key={value}
            tag={value}
            onButtonClick={() => {
              onChange(values.filter((t) => t !== value))
            }}
          />
        ))}
      </div>
    </>
  )
}
