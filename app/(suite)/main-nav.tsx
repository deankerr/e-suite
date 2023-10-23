import { cn } from '@/lib/utils'
import { AvatarIcon, ChatBubbleIcon, IdCardIcon, ImageIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { NavTab } from './nav-tab'

type Props = {} & React.HTMLAttributes<HTMLDivElement>

export function MainNav({ className }: Props) {
  const tabs = [
    { route: 'chat', label: 'Chat', icon: <ChatBubbleIcon /> },
    { route: 'image', label: 'Image', icon: <ImageIcon /> },
    { route: 'agent', label: 'Agent', icon: <AvatarIcon /> },
    { route: 'profile', label: 'Profile', icon: <IdCardIcon /> },
  ]

  return (
    <nav className={cn('flex w-full text-xs sm:max-w-[4rem] sm:flex-col', className)}>
      {tabs.map((tab) => {
        return (
          <Link key={tab.route} href={tab.route} className="contents">
            <NavTab route={tab.route}>
              {tab.icon}
              {tab.label}
            </NavTab>
          </Link>
        )
      })}
    </nav>
  )
}
