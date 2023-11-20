import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/app-shell'
import { AppSidebar } from '@/components/app-sidebar'
import { getSession } from '@/lib/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  return (
    <AppShell>
      <AppSidebar className="bg-muted" />
      {children}
    </AppShell>
  )
}
