import { NavRail } from '@/components/layout/NavRail'

const maintenanceMode = true

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  if (maintenanceMode) return 'brb'

  return (
    <>
      <div className="fixed flex h-svh w-full flex-col sm:flex-row">
        {/* background layer */}
        <div className="pointer-events-none fixed inset-0 bg-orange-1">
          <div className="fixed inset-0 bg-gradient-to-br from-orange-3 via-orange-1 to-iris-1"></div>
          <div className='fixed inset-0 bg-[url("/nn2.svg")]' />
        </div>

        <NavRail />
        <div className="h-[calc(100svh_-_var(--nav-rail-height))] w-full sm:h-full">{children}</div>
      </div>
    </>
  )
}
