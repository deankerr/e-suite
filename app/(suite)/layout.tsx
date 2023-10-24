import { MainHeader } from './main-header'
import { MainNav } from './main-nav'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="main-grid">
      <MainHeader className="main-header" />
      <MainNav className="main-nav" />
      <main className="main-content flex flex-col overflow-x-auto">{children}</main>
    </div>
  )
}
