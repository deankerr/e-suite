import { NavRail } from '@/components/layout/NavRail'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed flex h-full w-full">
      <NavRail className="hidden h-full" />
      {children}
    </div>
  )
}
