import { NavRail } from '@/app/components/NavRail'

const BetaLayout = ({ children }: { children: React.ReactNode }) => (
  <div id="beta-layout" className="dark:bg-grid-dark flex h-dvh">
    <NavRail />
    {children}
  </div>
)

export default BetaLayout
