import { cn } from '@/lib/utils'
import { CheckIcon, Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { Loading } from './ui/loading'

export function EditButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <Pencil1Icon />
    </Button>
  )
}

export function LoadingButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" {...props}>
      <Loading size="xs" />
    </Button>
  )
}

export function CancelButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" size="icon" {...props}>
      <Cross2Icon />
    </Button>
  )
}
export function ConfirmButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="default" size="icon" {...props}>
      <CheckIcon />
    </Button>
  )
}
