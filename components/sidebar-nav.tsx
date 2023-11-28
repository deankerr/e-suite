'use client'

import { cn } from '@/lib/utils'
import { AvatarIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/Link'
import { usePathname } from 'next/navigation'
import { CreateAgentDialog } from './create-agent-dialog'
import { useGetAgentList } from './queries'
import { Button } from './ui/button'

export function SidebarNav({ className }: React.ComponentProps<'div'>) {
  const agents = useGetAgentList()

  return (
    <div className={cn('flex w-full flex-col p-3', className)}>
      <NavLink href="/">
        <AvatarIcon className="h-5 w-5" />
        Agents
      </NavLink>
      {agents.data?.map((agent) => (
        <NavLink key={agent.id} href={'/agent/' + agent.id} variant="entity">
          {agent.name}
        </NavLink>
      ))}
      <CreateAgentDialog>
        <Button className="mt-4 w-fit gap-2 self-center dark:bg-primary/90 dark:text-primary-foreground/90 dark:hover:bg-primary">
          <PlusCircledIcon className="h-5 w-5" /> New Agent
        </Button>
      </CreateAgentDialog>
    </div>
  )
}

const navAll =
  'flex cursor-pointer items-center py-2 justify-start gap-1.5 rounded-md hover:bg-stone-300 dark:hover:bg-stone-700 hover:text-foreground'
const navVariants = {
  main: 'font-medium text-foreground/90 px-3',
  entity: 'mx-3 px-3 py-1 text-foreground/80',
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
        isActive && 'bg-stone-300 font-medium text-foreground dark:bg-stone-700',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
