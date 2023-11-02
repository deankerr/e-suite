import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'
import { serverSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { SignInOutButton } from './sign-in-out-button'

export async function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const session = await serverSession()
  return (
    <header className={cn('flex items-center justify-between border-b px-3 py-2', className)}>
      <div className="flex space-x-5">
        <ChatBubbleIcon />
        <h1 className="font-semibold tracking-tight">{siteConfig.name}</h1>
      </div>

      {session && (
        <Avatar>
          <AvatarImage src={session.user?.image ?? ''} alt="avatar" />
          <AvatarFallback>e</AvatarFallback>
        </Avatar>
      )}
      <SignInOutButton session={session} />
    </header>
  )
}
