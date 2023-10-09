import { RscChatDemo } from '@/components/rsc-chat/rsc-chat'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function RscChatPage() {
  return (
    <div className="bg-grid-blue min-h-full">
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex h-16 w-full flex-row items-center justify-between border-2 border-border bg-background px-8 text-foreground"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">rsc chat</h1>
        <ThemeToggle />
      </div>

      {/* Main */}
      <main>
        <RscChatDemo />
      </main>
    </div>
  )
}
