import { AppShell } from './AppShell'

export default function Layout({ children }: { children: React.ReactNode }) {
  // AppLayout
  return <AppShell>{children}</AppShell>
}
