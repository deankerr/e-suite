import { NavBar } from '@/components/NavBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div
      id="main-layout"
      className="dark:bg-grid-dark grid grid-rows-[3rem,_calc(100vh_-_3rem)] overflow-hidden"
    >
      <NavBar />
      {children}
    </div>
  )
}
