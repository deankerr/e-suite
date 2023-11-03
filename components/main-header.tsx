import { siteConfig } from '@/config/site'
import { serverSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { SignInOutButton } from './sign-in-out-button'
import { ThemeToggle } from './ui/theme-toggle'

export async function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const session = await serverSession()

  return (
    <header className={cn('px-2 sm:px-[3rem]', className)}>
      <div className="flex h-full items-center justify-between border-b">
        <h1 className="flex items-center gap-1.5 font-semibold tracking-tight">
          <ChatBubbleIcon className="mb-0.5 h-5 w-5" />
          {siteConfig.name}
        </h1>

        <div className="flex space-x-2">
          <ThemeToggle />
          <SignInOutButton session={session} />
        </div>
      </div>
    </header>
  )
}
