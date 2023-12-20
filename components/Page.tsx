import { cn } from '@/lib/utils'

type PageSectionProps = {
  className?: React.ComponentProps<'div'>['className']
  children?: React.ReactNode
}

const PageRoot = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn('flex grow rounded-2xl bg-gray-50 text-zinc-50 dark:bg-gray-800', className)}
    >
      {children}
    </div>
  )
}

const Main = ({ children, className }: PageSectionProps) => {
  return <div className={cn(' grow', className)}>{children}</div>
}

const MainHeader = ({ children, className }: PageSectionProps) => {
  return (
    <div
      className={cn('flex h-20  w-full items-center border-b-2 border-gray-700 px-8', className)}
    >
      {children}
    </div>
  )
}

const MainContent = ({ children, className }: PageSectionProps) => {
  return <div className={cn('w-full space-y-4 p-8 ', className)}>{children}</div>
}

const Aside = ({ children, className }: PageSectionProps) => {
  return <div className={cn('w-80 shrink-0 border-l-2 border-gray-700', className)}>{children}</div>
}

const AsideHeader = ({ children, className }: PageSectionProps) => {
  return (
    <div className={cn('flex h-20 items-center border-b-2 border-gray-700 px-8', className)}>
      {children}
    </div>
  )
}

const AsideContent = ({ children, className }: PageSectionProps) => {
  return <div className={cn('p-8', className)}>{children}</div>
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
  Aside,
  AsideHeader,
  AsideContent,
  H1,
})
