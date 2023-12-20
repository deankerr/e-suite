import { AppSidebar } from './AppSidebar'
import { SectionPageDemo } from './SectionPageDemo'
import { UiDemoPage } from './UiDemoPage'

export const AppShell = () => {
  return (
    <div className="flex h-full bg-gray-900">
      <AppSidebar />
      <div className="flex w-full p-5 pl-0">
        {/* <UiDemoPage /> */}
        <SectionPageDemo />
      </div>
    </div>
  )
}
