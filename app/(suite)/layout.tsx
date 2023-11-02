import { MainHeader } from '@/components/main-header'
import { MainNav } from '@/components/main-nav'

export default function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <MainHeader className="" />
      {children}
    </div>
  )
}
