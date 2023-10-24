import { MainHeader } from './main-header'
import { MainNav } from './main-nav'

type Props = {
  children: React.ReactNode
}

export default function SuiteLayout({ children }: Props) {
  return (
    <div className="main-grid overflow-hidden">
      <MainHeader className="main-header" />
      <MainNav className="main-nav" />
      <main className="main-content overflow-x-auto overflow-y-hidden">{children}</main>
    </div>
  )
}
