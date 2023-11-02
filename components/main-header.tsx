import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { siteConfig } from '@/config/site'
import { serverSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { SignInOutButton } from './sign-in-out-button'

export async function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const session = await serverSession()
  return (
    <header
      className={cn('flex items-center justify-between border-b py-2 pl-[2.5rem] pr-6', className)}
    >
      <div className="flex items-center space-x-2 pl-3">
        <ChatBubbleIcon className="" />
        <h1 className="font-semibold tracking-tight">{siteConfig.name}</h1>
      </div>

      {session && (
        <Avatar>
          <AvatarImage src={session.user?.image ?? ''} alt="avatar" />
          <AvatarFallback>e</AvatarFallback>
        </Avatar>
      )}
      <SignInOutButton session={session} variant={session ? 'outline' : 'default'} />
    </header>
  )
}
