import { TopBar } from '@/components/ui/TopBar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // ChatLayout

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <TopBar />
      {children}
    </div>
  )
}
