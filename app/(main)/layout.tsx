import { Navbar } from '@/app/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="grid h-dvh grid-rows-[theme(spacing.16)_auto] overflow-hidden">
      <Navbar />
      {children}
      {/* <div className="flex items-center border-t border-gray-6"></div> */}
    </div>
  )
}
