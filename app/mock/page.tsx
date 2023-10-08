import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function MockPage() {
  return (
    <div id="app-page" className="bg-grid-blue h-full">
      <Button>Hello</Button>
      <ThemeToggle />
    </div>
  )
}
