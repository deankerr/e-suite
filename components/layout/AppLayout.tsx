import { ThreadBar } from '@/components/command-menu/ThreadBar'
import { InputBar } from '@/components/input-bar/InputBar'
import { UserSegment } from '@/components/layout/UserSegment'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import { preloadThreads } from '@/lib/api.server'
import { cn } from '@/lib/utils'

export const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const preloadedThreads = await preloadThreads()
  return (
    <>
      <div className={cn('mx-auto min-h-screen max-w-8xl')}>
        <header className="flex h-11 items-center justify-between gap-2 bg-gray-1 px-1">
          <AppLogoTitle />
          <ThreadBar preloadedThreads={preloadedThreads} />
          <UserSegment />
        </header>

        {children}
        <InputBar />
      </div>
    </>
  )
}

// const bgDots_o1 = 'bg-dot-[#17120e]'
// const bgDots_o2 = 'bg-dot-[#1e160f]'
// const bgDots_o3 = 'bg-dot-[#331e0b]'
// const bgDots_o4 = 'bg-dot-[#462100]'
// const bgDots_o5 = 'bg-dot-[#562800]'
// const bgDots_o6 = 'bg-dot-[#66350c]'
// const bgDots_o7 = 'bg-dot-[#7e451d]'
// const bgDots_o8 = 'bg-dot-[#a35829]'
// const bgDots_o9 = 'bg-dot-[#f76b15]'
// const bgDots_o10 = 'bg-dot-[#ff801f]'
// const bgDots_o11 = 'bg-dot-[#ffa057]'
// const bgDots_o12 = 'bg-dot-[#ffe0c2]'
// bg-gradient-radial from-orange-2 to-[84%]
// const bgSun = 'bg-[length:70%] bg-sun-large-[#1E160F] sm:bg-auto'
