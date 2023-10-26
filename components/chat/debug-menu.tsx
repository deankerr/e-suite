import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
  label: React.ReactNode
  heading: React.ReactNode
  items: Array<[React.ReactNode, () => void]>
} & React.HTMLAttributes<HTMLButtonElement>

export function DebugMenu({ label, heading, items, ...props }: Props) {
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
