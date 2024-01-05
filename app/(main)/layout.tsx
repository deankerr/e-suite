import { Navbar } from '@/app/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="grid h-dvh grid-rows-[theme(spacing.10)_auto] overflow-hidden md:grid-rows-[theme(spacing.14)_auto]">
      <Navbar />
      {children}
    </div>
  )
}
