import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CrossCircledIcon } from '@radix-ui/react-icons'

export function TagInput({
  field,
  setEnabled,
}: {
  field: { value: string[]; onChange: (newValue: unknown) => void }
  setEnabled: () => void
}) {
  const { value, onChange, ...rest } = field

  const tags = field ? value : []

  const addTag = (tag: string) => {
    if (!tag || tags.includes(tag)) return
    setEnabled()
    onChange([...tags, tag])
  }

  const removeTag = (tag: string) => {
    setEnabled()
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="w-full space-y-2" {...rest}>
      {tags.map((tag) => (
        <Badge
          className="pointer-events-none ml-1 justify-between gap-1 pr-1 font-sans text-sm font-normal hover:bg-primary"
          key={tag}
        >
          {tag}
          <Button
            className="pointer-events-auto h-5 w-7"
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => removeTag(tag)}
          >
            <CrossCircledIcon />
          </Button>
        </Badge>
      ))}
      <Input
        placeholder="Add stop sequence..."
        className="ml-1 inline h-8 w-64"
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          addTag(e.currentTarget.value)
          e.currentTarget.value = ''
        }}
      />
    </div>
  )
}
