import { Label } from '@radix-ui/react-label'
import { TextArea } from '@radix-ui/themes'
import { SearchIcon } from 'lucide-react'

import { TextField, TextFieldSlot } from '@/components/ui/TextField'
import { cn } from '@/lib/utils'

export const BohTextInput = ({ className, ...props }: React.ComponentProps<typeof TextField>) => {
  props.placeholder ??= props.name
  return (
    <Label className={cn('text-xs font-semibold', className)}>
      {props.name ?? 'unnamed'} <span className="font-normal text-gray-10">string</span>
      <TextField {...props} />
    </Label>
  )
}

export const BohTextareaInput = ({
  className,
  ...props
}: React.ComponentProps<typeof TextArea>) => {
  props.placeholder ??= props.name
  return (
    <Label className={cn('text-xs font-semibold', className)}>
      {props.name ?? 'unnamed'} <span className="font-normal text-gray-10">string</span>
      <TextArea {...props} className="text-sm font-normal" />
    </Label>
  )
}

export const BohNumberInput = ({ className, ...props }: React.ComponentProps<typeof TextField>) => {
  props.placeholder ??= props.name
  return (
    <Label className={cn('text-xs font-semibold', className)}>
      {props.name ?? 'unnamed'} <span className="font-normal text-gray-10">number</span>
      <TextField {...props} type="number" />
    </Label>
  )
}

export const BohSearchInput = (props: React.ComponentProps<typeof TextField>) => {
  return (
    <TextField placeholder="search..." {...props}>
      <TextFieldSlot>
        <SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
      </TextFieldSlot>
    </TextField>
  )
}
