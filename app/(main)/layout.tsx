import { Navbar } from '@/app/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="dark:bg-grid-dark grid-pile grid h-dvh overflow-hidden p-rx-1">
      <Navbar />
      {children}
    </div>
  )
}
