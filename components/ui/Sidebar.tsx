import { cn } from '@/lib/utils'
import {
  BotIcon,
  CherryIcon,
  ComponentIcon,
  HomeIcon,
  LogInIcon,
  MessageSquareTextIcon,
  PanelLeftCloseIcon,
  SunIcon,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Logo } from '../Logo'
import { ThemeToggleButton } from './ThemeToggleButton'

type SidebarProps = {
  props?: any
}

export const Sidebar = ({ props }: SidebarProps) => {
  return (
    <div id="es-sidebar" className="flex h-full w-72 shrink-0 flex-col overflow-y-auto text-n-300">
      {/* Brand */}
      <div className="px-6">
        <Link href="/" className="">
          <Logo className="text-n-100" />
        </Link>
      </div>
      {/* Nav */}
      <nav className="flex w-full flex-col flex-wrap py-6">
        <ul className="space-y-0.5 px-6">
          <SidebarItem href="/" icon={<HomeIcon />}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/chat" icon={<MessageSquareTextIcon />}>
            Chat
          </SidebarItem>
          <SidebarItem href="#" icon={<ComponentIcon />}>
            Models
          </SidebarItem>
          <SidebarItem href="#" icon={<BotIcon />}>
            Agents
          </SidebarItem>
          <SidebarItem href="/ui-demo" icon={<CherryIcon />}>
            UI Demo
          </SidebarItem>
        </ul>

        <div className="w-full px-3 py-4">
          <hr className="border-n-800" />
        </div>

        <ul className="space-y-0.5 px-6">
          <SidebarItem href="#" icon={<LogInIcon />}>
            Log In
          </SidebarItem>
          <SidebarItem href="#" icon={<UserPlus />}>
            Sign Up
          </SidebarItem>
        </ul>
      </nav>

      {/* spacer */}
      <div className="grow" />

      {/* end buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <ThemeToggleButton />
        <IconButton>
          <PanelLeftCloseIcon />
        </IconButton>
      </div>
    </div>
  )
}

type SidebarItemProps = {
  icon?: React.ReactNode
  href: string
  children?: React.ReactNode
  className?: string
}

const SidebarItem = ({ children, href, className, icon }: SidebarItemProps) => {
  const segment = useSelectedLayoutSegment()
  const isActive = '/' + (segment ?? '') === href
  return (
    <li>
      <Link
        className={cn(
          'flex w-full items-center gap-x-5 rounded-lg px-2.5 py-3 text-sm font-medium transition-colors duration-300 hover:text-n-100',
          isActive && 'bg-n-800 text-n-100',
          className,
        )}
        href={href}
      >
        {icon}
        {children}
      </Link>
    </li>
  )
}

const IconButton = ({ children }: React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      className="flex h-[2.875rem] w-[2.875rem] flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-n-950 text-sm font-semibold text-n-300 transition-colors duration-300 hover:bg-n-900 hover:text-n-100 disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  )
}
