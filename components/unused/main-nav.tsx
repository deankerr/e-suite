import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { AvatarIcon, ChatBubbleIcon, IdCardIcon, ImageIcon } from '@radix-ui/react-icons'
import { SignInOutButton } from '../sign-in-out-button'
import { TabLink } from './tab-link'

export async function MainNav({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const tabs = [
    { route: 'chat', label: 'Chat', icon: <ChatBubbleIcon /> },
    { route: '/', label: 'e', icon: <ImageIcon /> },
    { route: 'agent', label: 'Agent', icon: <AvatarIcon /> },
    { route: 'profile', label: 'Profile', icon: <IdCardIcon /> },
  ]

  return (
    <nav
      className={cn(
        'flex items-center justify-around py-1 text-center sm:flex-col sm:border-r sm:border-t-0',
        className,
      )}
    >
      {/* {tabs.map((t) => (
        <TabLink
          href={`/${t.route}`}
          key={t.route}
          className="flex max-h-[4rem] grow flex-col items-center justify-center gap-1.5 border-b-[3px] text-xs uppercase text-foreground/50 hover:bg-muted hover:text-foreground sm:border-b-0 " // sm:border-l-[3px]
          activeClassName="border-primary bg-muted/70 text-foreground"
        >
          {t.icon}
          {t.label}
        </TabLink>
      ))} */}
    </nav>
  )
}
