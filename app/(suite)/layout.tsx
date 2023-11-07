import { MainHeader } from '@/components/main-header'
import { MainStatusBar } from '@/components/main-status-bar'

//^   (suite) layout
//*   public

export default async function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[3rem_1fr_2.75rem]">
      <MainHeader />
      {children}
      <MainStatusBar />
    </div>
  )
}
