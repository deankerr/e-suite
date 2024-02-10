import { NavRail } from '../components/NavRail'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div id="main-layout" className="dark:bg-grid-dark flex h-dvh overflow-hidden">
      <NavRail />
      {children}
    </div>
  )
}
