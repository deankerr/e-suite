import { NavigationRail } from '@/components/navigation/NavigationRail'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5"
      id="app-layout"
      vaul-drawer-wrapper=""
    >
      <NavigationRail />
      {children}
    </div>
  )
}
