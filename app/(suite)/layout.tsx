import { MainHeader } from './main-header'
import { MainNav } from './main-nav'

export default function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-grid overflow-hidden">
      <MainHeader className="main-header" />
      <MainNav className="main-nav" />
      <main className="main-content overflow-x-auto overflow-y-hidden">{children}</main>
    </div>
  )
}
