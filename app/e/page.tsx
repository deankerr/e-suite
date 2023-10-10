import { ChatApp } from '@/components/e-suite/chat/chat'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import * as R from 'remeda'

export const metadata = {
  title: 'e/suite',
  description: 'e/suite',
}

export default function eSuitePage() {
  return (
    <div className="bg-grid-grey flex h-[100svh] flex-col items-center justify-between">
      <TuiBreakpointIndicator />
      {/* Header Bar */}
      <div
        id="ui-header"
        className="flex h-14 w-full flex-row items-center justify-between overflow-x-auto bg-background px-8 py-1 text-foreground"
      >
        <div className="">
          <h1 className={cn('text-xl', randomText())}>e/suite</h1>
        </div>

        <ThemeToggle />
      </div>

      {/* Main */}
      {/* <main className="bg-grid-grey flex grow flex-col items-center justify-center"> */}
      {/* Chat Component Instance */}
      <ChatApp />
      {/* </main> */}
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

function randomText() {
  const fnt = R.shuffle(['font-mono', 'font-serif', 'font-sans'])[0]
  const wgt = R.shuffle([
    'font-thin',
    'font-extralight',
    'font-light',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-extrabold',
    'font-black',
  ])[0]
  const trk = R.shuffle([
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
  ])[0]
  const it = Math.random() > 0.9 ? 'italic' : ''
  return cn(fnt, wgt, trk, it)
}
