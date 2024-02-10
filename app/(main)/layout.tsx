import { NavRail } from '../components/NavRail'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div id="main-layout" className="dark:bg-grid-dark grid h-dvh grid-flow-col overflow-hidden">
      <NavRail />
      {children}
    </div>
  )
}
