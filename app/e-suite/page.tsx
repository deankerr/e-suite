import { ChatApp } from '@/components/e-suite/chat/chat'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

export default function eSuitePage() {
  return (
    <div className="flex min-h-[100svh] flex-col justify-between">
      <TuiBreakpointIndicator />
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex h-16 w-full flex-row items-center justify-between border-b-2 border-border bg-background px-8 text-foreground"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">e/suite</h1>

        <ThemeToggle />
      </div>

      {/* Main */}
      <main className="bg-grid-grey flex grow flex-col">
        {/* Chat Component Instance */}
        <ChatApp />
      </main>
    </div>
  )
}

export function TuiBreakpointIndicator({ className }: React.HTMLAttributes<HTMLDivElement>) {
  // const bgColors = 'bg-red-100 sm:bg-red-300 md:bg-red-500 xl:bg-red-700 2xl:bg-red-900'
  const content =
    "after:content-['xs'] sm:after:content-['sm'] md:after:content-['md'] xl:after:content-['xl'] 2xl:after:content-['2xl']"
  return (
    <div
      className={cn(
        'fixed right-0 z-50 flex h-6 w-5 place-items-center text-xs',
        content,
        className,
      )}
    ></div>
  )
}
