import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function MainHeader({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn('flex items-center justify-between border-b px-2 py-2 md:px-6', className)}
    >
      <h1 className="font-semibold tracking-tight">{siteConfig.name}</h1>
      <ThemeToggle />
    </header>
  )
}
