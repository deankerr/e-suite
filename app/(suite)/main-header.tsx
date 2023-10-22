import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'

type Props = {}

export function MainHeader(props: Props) {
  return (
    <header className="flex items-center justify-between border-b px-2 py-1 md:px-6">
      <h1 className="font-bold tracking-tight">{siteConfig.name}</h1>
      <ThemeToggle />
    </header>
  )
}
