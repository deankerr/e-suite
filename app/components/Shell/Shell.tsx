import { cn } from '@/lib/utils'
import { Card, IconButton } from '@radix-ui/themes'
import { LucideIcon, PanelTopIcon } from 'lucide-react'
import { CardLite } from '../ui/CardLite'

const Root = ({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<typeof Card>) => {
  return (
    <CardLite
      className={cn(
        'mx-auto md:grid md:grid-cols-[auto_18rem] md:grid-rows-[2.5rem_minmax(6rem,auto)]',
        className,
      )}
      {...props}
    >
      {children}
    </CardLite>
  )
}

const TitleBar = ({
  children,
  className,
  icon,
  ...props
}: { children?: React.ReactNode; icon?: LucideIcon } & React.ComponentProps<'div'>) => {
  const Icon = icon ?? PanelTopIcon
  return (
    <div
      className={cn(
        'col-start-1 row-start-1 flex items-center border-b bg-gray-1 px-rx-1 text-sm md:text-base',
        className,
      )}
      {...props}
    >
      <IconButton variant="ghost" className="m-0">
        <Icon className="size-5 stroke-1" />
      </IconButton>
      {children}
    </div>
  )
}

const Content = ({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) => {
  return <div className={cn('col-start-1 row-start-2 min-h-96 p-rx-1', className)}>{children}</div>
}

const Controls = ({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'col-start-2 row-start-1 flex items-center justify-center gap-1 border-b border-l bg-gray-1 p-rx-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

const Sidebar = ({
  children,
  className,
}: { children?: React.ReactNode } & React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('col-start-2 row-start-2 flex flex-col border-l bg-gray-1 p-rx-1', className)}
    >
      {children}
    </div>
  )
}

export const Shell = Object.assign({}, { Root, TitleBar, Content, Controls, Sidebar })
