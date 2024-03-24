import { TopBar } from '@/components/ui/TopBar'

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  // GenerateLayout

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <TopBar />
      <div className="flex grow overflow-hidden">{children}</div>
    </div>
  )
}
