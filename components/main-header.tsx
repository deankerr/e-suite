import { siteConfig } from '@/config/site'
import { serverSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { SignInOutButton } from './sign-in-out-button'

export async function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const session = await serverSession()

  return (
    <header className={cn('border-b px-2 sm:px-[3rem]', className)}>
      <div className="flex h-full items-center justify-between px-2">
        <h1 className="flex items-center gap-2.5 font-semibold tracking-tight">
          <ChatBubbleIcon className="h-5 w-5" />
          {siteConfig.name}
        </h1>

        <SignInOutButton session={session} />
      </div>
    </header>
  )
}
