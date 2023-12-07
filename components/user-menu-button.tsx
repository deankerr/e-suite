import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { _throws_getUserSession } from '@/data/auth'
import Link from 'next/link'
import { Button } from './ui/button'

export async function UserMenuButton({ className }: {} & React.ComponentProps<'div'>) {
  const session = await _throws_getUserSession()
  if (!session)
    return (
      <Button asChild>
        <Link href="/api/auth/login">log in</Link>
      </Button>
    )

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
        <PopoverContent className="flex w-40 items-center justify-center">
          <Button variant="outline" asChild>
            <Link href="/api/auth/logout">sign out</Link>
          </Button>
        </PopoverContent>
      </Popover>
    </>
  )
}
