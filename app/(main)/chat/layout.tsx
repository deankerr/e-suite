import { HeaderBar } from '@/components/ui/HeaderBar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // ChatLayout

  return (
    <div className="flex h-full grow flex-col overflow-hidden">
      <HeaderBar />
      {children}
    </div>
  )
}
