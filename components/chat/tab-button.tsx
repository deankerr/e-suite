import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export function TabButton({
  text,
  isActive,
  onClick,
}: {
  text: string
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'rounded-none py-2 text-sm text-foreground/60 hover:bg-inherit hover:text-foreground',
        isActive && 'border-b-2 border-primary text-foreground',
      )}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}
