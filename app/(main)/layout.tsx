import { Nav } from '../components/Nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return <div className="dark:bg-grid-dark grid-pile grid h-dvh overflow-hidden">{children}</div>
}
