import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="bg-shell flex h-full">
      <AppSidebar className="py-6" />
      <div className="flex w-full p-5 pl-0">{children}</div>
    </div>
  )
}
