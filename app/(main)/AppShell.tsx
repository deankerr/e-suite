import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-full bg-gray-900">
      <AppSidebar />
      <div className="flex w-full p-5 pl-0">{children}</div>
    </div>
  )
}
