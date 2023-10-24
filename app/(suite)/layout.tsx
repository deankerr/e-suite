import { MainHeader } from './main-header'
import { MainNav } from './main-nav'

export default function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-grid">
      <MainHeader className="main-header" />
      <MainNav className="main-nav" />
      {children}
    </div>
  )
}
