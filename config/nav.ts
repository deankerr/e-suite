import {
  BotIcon,
  CherryIcon,
  ComponentIcon,
  HomeIcon,
  LogInIcon,
  LucideIcon,
  MessageSquareTextIcon,
  PanelLeftCloseIcon,
  SunIcon,
  UserPlus,
} from 'lucide-react'

export const navConfig = [
  [
    { href: '/', icon: HomeIcon, label: 'Dashboard' },
    { href: '/chat', icon: MessageSquareTextIcon, label: 'Chat' },
    { href: '#', icon: ComponentIcon, label: 'Models' },
    { href: '/agents', icon: BotIcon, label: 'Agents' },
  ],
  [
    { href: '#', icon: LogInIcon, label: 'Log In' },
    { href: '#', icon: UserPlus, label: 'Sign Up' },
  ],
] as const
