import { AppSidebar } from './AppSidebar'

type AppShellProps = {
  props?: any
}
export const AppShell = ({ props }: AppShellProps) => {
  return (
    <div className="flex h-full divide-x">
      <AppSidebar />
    </div>
  )
}
