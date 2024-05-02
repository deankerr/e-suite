// bg-gradient-radial from-orange-2 to-[84%]

import { cn } from '@/lib/utils'
import { CommandBar } from '../command-bar/CommandBar'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const bgSun = 'bg-[length:70%] bg-sun-large-[#1E160F] sm:bg-auto'
  const bgDots = 'bg-dot-[#3B1219]'

  return (
    <div className={cn('min-h-screen max-w-8xl px-1 sm:px-4', bgSun)}>
      <div className={cn('min-h-screen', bgDots)}>
        {children}
        <CommandBar />
      </div>
    </div>
  )
}
