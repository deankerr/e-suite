'use client'

import { cn } from '@/lib/utils'
import { AvatarIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/Link'
import { usePathname } from 'next/navigation'
import { useGetAgentList } from './queries'

export function SidebarNav({ className }: React.ComponentProps<'div'>) {
  const agents = useGetAgentList()

  return (
    <div className={cn('flex w-full flex-col border p-3', className)}>
      <NavLink href="/">
        <AvatarIcon className="h-5 w-5" />
        Agents
      </NavLink>
      {agents.data?.map((agent) => (
        <NavLink key={agent.id} href={'/agent/' + agent.id} variant="entity">
          {agent.name}
        </NavLink>
      ))}
      <NavAction variant="main">
        <PlusCircledIcon className="h-5 w-5" /> New Agent
      </NavAction>
    </div>
  )
}

const navAll =
  'flex cursor-pointer items-center py-2 justify-start gap-1.5 rounded-md px-2 hover:bg-stone-700 hover:text-foreground'
const navVariants = {
  main: 'font-medium text-foreground/90',
  entity: 'mx-3 py-1 pl-6 text-foreground/80 font-medium',
} as const

function NavLink({
  variant = 'main',
  href,
  className,
  children,
  ...props
}: { variant?: keyof typeof navVariants } & React.ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={cn(
        navAll,
        navVariants[variant],
        isActive && 'bg-stone-700 text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export function NavAction({
  variant = 'main',
  className,
  children,
}: { variant?: keyof typeof navVariants } & React.ComponentProps<'div'>) {
  return <div className={cn(navAll, navVariants[variant], className)}>{children}</div>
}
