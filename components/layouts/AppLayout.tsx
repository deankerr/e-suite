// bg-gradient-radial from-orange-2 to-[84%]

import { AppClientLayout } from '@/components/layouts/AppClientLayout'
import { cn } from '@/lib/utils'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const bgSun = 'bg-[length:70%] bg-sun-large-[#1E160F] sm:bg-auto'
  const bgDots = 'bg-dot-[#3B1219]'

  return (
    <div className={cn('min-h-screen max-w-8xl', bgSun)}>
      <div className={cn('min-h-screen', bgDots)}>
        {children}
        <AppClientLayout />
      </div>
    </div>
  )
}
