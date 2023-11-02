import { MainHeader } from '@/components/main-header'
import { MainNav } from '@/components/main-nav'

export default function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr_2.75rem] sm:grid-cols-[3rem_auto_3rem]">
      <MainHeader className="sm:col-span-3" />
      {children}
    </div>
  )
}
