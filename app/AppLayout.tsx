import { NavRail } from '@/app/NavRail'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5" id="app-layout">
      <NavRail />
      {children}
    </div>
  )
}
