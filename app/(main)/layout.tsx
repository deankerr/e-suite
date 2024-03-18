import { NavBar } from '@/components/NavBar'
import { UserButton } from '@clerk/nextjs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div className="flex h-full overflow-hidden">
      <NavBar>
        <UserButton />
      </NavBar>
      {children}
    </div>
  )
}
