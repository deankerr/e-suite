import { NavBar } from '@/components/NavBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="flex h-full overflow-hidden">
      <NavBar />
      {children}
    </div>
  )
}
