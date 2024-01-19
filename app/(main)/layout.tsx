import { Navbar } from '@/app/components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="dark:bg-grid-dark grid-pile h-dvh overflow-hidden">
      <Navbar />
      {children}
    </div>
  )
}
