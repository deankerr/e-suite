import { cn } from '@/lib/utils'

type PageSectionProps = {
  className?: React.ComponentProps<'div'>['className']
  children?: React.ReactNode
}

const PageRoot = ({ children, className }: PageSectionProps) => {
  return <div className={cn('flex grow', className)}>{children}</div>
}

const Main = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'flex grow flex-col bg-n-50 text-n-900 first:rounded-l-xl last:rounded-r-xl dark:border-n-700 dark:bg-n-800 dark:text-n-100',
        className,
      )}
    >
      {children}
    </div>
  )
}

const MainHeader = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'flex h-20 w-full flex-none items-center border-b px-8 dark:border-n-700',
        className,
      )}
    >
      {children}
    </div>
  )
}

const MainContent = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'w-full grow space-y-4 overflow-x-auto overflow-y-auto p-8 shadow-inner',
        className,
      )}
    >
      {children}
    </div>
  )
}

const MainFooter = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'flex h-20 w-full flex-none items-center border-t px-8 dark:border-n-700',
        className,
      )}
    >
      {children}
    </div>
  )
}

const Aside = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'relative inset-0 flex w-80 shrink-0 flex-col rounded-r-xl border-l border-n-200 bg-n-100 dark:border-n-700 dark:bg-n-800 dark:text-n-100',
        className,
      )}
      style={{ boxShadow: 'inset 0 3em 6em rgba(0, 0, 0, .05)' }}
    >
      {children}
    </div>
  )
}

const AsideHeader = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn(
        'flex h-20 flex-none items-center overflow-y-auto overflow-x-clip border-b px-8 dark:border-n-700',
        className,
      )}
    >
      {children}
    </div>
  )
}

const AsideContent = ({ children, className }: PageSectionProps) => {
  return <div className={cn('grow p-8', className)}>{children}</div>
}

const H1 = ({ children, className }: PageSectionProps) => {
  return (
    <h1 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h1>
  )
}

export const Page = Object.assign(PageRoot, {
  Main,
  MainHeader,
  MainContent,
  MainFooter,
  Aside,
  AsideHeader,
  AsideContent,
  H1,
})
