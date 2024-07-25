import * as Icons from '@phosphor-icons/react/dist/ssr'

import { TextField, TextFieldSlot } from '@/components/ui/TextField'

export const SearchField = (props: React.ComponentProps<typeof TextField>) => {
  return (
    <TextField {...props}>
      <TextFieldSlot>
        <Icons.MagnifyingGlass className="size-4 shrink-0 opacity-50" />
      </TextFieldSlot>
    </TextField>
  )
}
