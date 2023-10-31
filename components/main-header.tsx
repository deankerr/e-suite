import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'
import { serverSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { SignInOutButton } from './sign-in-out-button'

export async function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const session = await serverSession()
  return (
    <header
      className={cn('flex items-center justify-between border-b px-2 py-2 md:px-6', className)}
    >
      <h1 className="font-semibold tracking-tight">{siteConfig.name}</h1>
      <div className="flex gap-2">
        <ThemeToggle />
        {session && (
          <Avatar>
            <AvatarImage src={session.user?.image ?? ''} alt="avatar" />
            <AvatarFallback>e</AvatarFallback>
          </Avatar>
        )}
        <SignInOutButton session={session} />
      </div>
    </header>
  )
}
