import { cn } from '@/lib/utils'
import { AvatarIcon, ChatBubbleIcon, IdCardIcon, ImageIcon } from '@radix-ui/react-icons'
import { TabLink } from './tab-link'

type Props = {} & React.HTMLAttributes<HTMLDivElement>

export function MainNav({ className }: Props) {
  const tabs = [
    { route: 'chat', label: 'Chat', icon: <ChatBubbleIcon /> },
    { route: 'image', label: 'Image', icon: <ImageIcon /> },
    { route: 'agent', label: 'Agent', icon: <AvatarIcon /> },
    { route: 'profile', label: 'Profile', icon: <IdCardIcon /> },
  ]

  return (
    <nav className={cn('flex text-xs sm:flex-col', className)}>
      {tabs.map((t) => (
        <TabLink
          href={t.route}
          key={t.route}
          className="flex max-h-[4rem] grow flex-col items-center justify-center gap-1.5 border-b-[3px] hover:bg-muted hover:text-foreground sm:border-b-0 sm:border-l-[3px]"
        >
          {t.icon}
          {t.label}
        </TabLink>
      ))}
    </nav>
  )
}
