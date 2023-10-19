import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  label: React.ReactNode
  heading: React.ReactNode
  items: Array<[React.ReactNode, () => void]>
} & React.HTMLAttributes<HTMLButtonElement>

export function ChatBarMenuItem({ label, heading, items, ...props }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" {...props}>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {heading ? (
          <>
            <DropdownMenuLabel>{heading}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {items.map((item, i) => (
          <DropdownMenuItem key={i} onSelect={item[1]}>
            {item[0]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
