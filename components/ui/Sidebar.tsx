import {
  BotIcon,
  ComponentIcon,
  HomeIcon,
  LogInIcon,
  MessageSquareCodeIcon,
  SunIcon,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '../Logo'
import { IconButton } from './Button'

type SidebarProps = {
  props?: any
}

export const Sidebar = ({ props }: SidebarProps) => {
  return (
    <div id="es-sidebar" className="flex h-full w-64 flex-col overflow-y-auto">
      {/* Brand */}
      <div className="px-6">
        <Link href="/" className="text-xl font-semibold">
          <Logo className="text-zinc-50" />
        </Link>
      </div>
      {/* Nav */}
      <nav className="flex w-full flex-col flex-wrap p-6">
        <ul className="space-y-1.5">
          <SidebarItem href="/">
            <HomeIcon />
            Dashboard
          </SidebarItem>

          <SidebarItem href="/">
            <MessageSquareCodeIcon />
            Chats
          </SidebarItem>

          <SidebarItem href="/">
            <ComponentIcon />
            Models
          </SidebarItem>

          <SidebarItem href="/">
            <BotIcon />
            Agents
          </SidebarItem>

          <hr className="border-gray-600" />

          <SidebarItem href="/">
            <LogInIcon />
            Log In
          </SidebarItem>

          <SidebarItem href="/">
            <UserPlus />
            Sign Up
          </SidebarItem>
        </ul>
      </nav>
      {/* spacer */}
      <div className="grow" />
      {/* end buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <IconButton>
          <SunIcon />
        </IconButton>
      </div>
    </div>
  )
}

const SidebarItem = ({ children, href }: React.ComponentProps<typeof Link>) => {
  return (
    <li>
      <Link
        className="flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-400 hover:bg-gray-800"
        href={href}
      >
        {children}
      </Link>
    </li>
  )
}
