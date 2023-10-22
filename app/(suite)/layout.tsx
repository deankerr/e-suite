import { MainHeader } from './main-header'
import { MainNav } from './main-nav'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <MainHeader />
      <div className="flex grow flex-col-reverse justify-between sm:flex-row">
        <MainNav />
        {children}
      </div>
    </div>
  )
}
