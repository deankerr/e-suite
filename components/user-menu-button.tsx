import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Session } from '@/lib/server'
import { Button } from './ui/button'

export function UserMenuButton({
  session,
  className,
}: { session: Session | null } & React.ComponentProps<'div'>) {
  if (!session) return '(no)'

  const { image } = session

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar className="h-10 w-10">
            {image && <AvatarImage src={image} />}
            <AvatarFallback>e?</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="flex items-center justify-center">
          <Button variant="outline">sign out</Button>
        </PopoverContent>
      </Popover>
    </>
  )
}
