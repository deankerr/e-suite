import { MainHeader } from '@/components/main-header'
import { MainStatusBar } from '@/components/main-status-bar'

//^   (suite) layout
//*   public

export default async function SuiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid h-full grid-rows-[3rem_auto_2.75rem] overflow-hidden">
        <MainHeader />
        {children}
        <MainStatusBar />
      </div>
      {/* <div className="absolute inset-0 grid grid-rows-6">gupm</div> */}
    </>
  )
}
