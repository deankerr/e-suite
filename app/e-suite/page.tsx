import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import {
  CodeSandboxLogoIcon,
  FaceIcon,
  MixerHorizontalIcon,
  PaperPlaneIcon,
  SketchLogoIcon,
} from '@radix-ui/react-icons'

export default function eSuitePage() {
  return (
    <div className="min-h-full">
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
      <main className="mt-6">
        {/* Chat Component Instance */}
        <div
          id="e-chat-component"
          className="mx-auto flex min-h-[85vh] max-w-xs flex-col rounded-md border-2 border-border bg-background text-sm"
        >
          {/* Chat Header/Controls */}
          <div className="flex items-center border-b px-2 py-1 font-medium">
            <Button variant="outline" size="icon" className="">
              <FaceIcon />
            </Button>
            <div className="h-full grow text-center">Alpaca Banana</div>
            <div>
              <Button variant="outline" size="icon" className="">
                <MixerHorizontalIcon />
              </Button>
              <Button variant="outline" size="icon" className="">
                <SketchLogoIcon />
              </Button>
              <Button variant="outline" size="icon" className="">
                <CodeSandboxLogoIcon />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div id="e-messages" className="flex flex-1 flex-col justify-end space-y-4 px-4 py-4">
            <div
              id="e-chat-user"
              className="max-w-[75%] rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow"
            >
              I would like to ask you many questions.
            </div>
            <div
              id="e-chat-ai"
              className="ml-auto max-w-[75%] rounded-lg bg-muted px-3 py-2 shadow"
            >
              As an AI, I cannot assist with this task.
            </div>
            <div
              id="e-chat-user"
              className="max-w-[75%] rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow"
            >
              Im saddened to hear that.
            </div>
            <div
              id="e-chat-ai"
              className="ml-auto max-w-[75%] rounded-lg bg-muted px-3 py-2 shadow"
            >
              As an AI, get used to it.
            </div>
          </div>

          {/* Input */}
          <div className="relative">
            <Textarea placeholder="Enter your message..." />
            <Button variant="secondary" size="icon" className="absolute right-4 top-[0.8em] shadow">
              <PaperPlaneIcon />
            </Button>
          </div>
        </div>
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
        'fixed right-0 z-50 flex h-6 w-5 place-items-center text-xs text-secondary',
        content,
        className,
      )}
    ></div>
  )
}
