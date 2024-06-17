import { SearchIcon } from 'lucide-react'

import { TextField, TextFieldSlot } from '@/components/ui/TextField'

export const SearchField = (props: React.ComponentProps<typeof TextField>) => {
  return (
    <TextField {...props}>
      <TextFieldSlot>
        <SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
      </TextFieldSlot>
    </TextField>
  )
}
