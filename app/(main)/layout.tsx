import { DevNav } from '../components/util/DevNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // AppLayout

  return (
    <div id="main-layout" className="dark:bg-grid-dark grid-pile grid h-dvh overflow-hidden">
      {children}
      <DevNav className="self-center justify-self-start" />
    </div>
  )
}
