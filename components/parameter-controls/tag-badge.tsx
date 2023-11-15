import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CrossCircledIcon } from '@radix-ui/react-icons'

export function TagBadge({
  tag,
  onButtonClick,
  className,
  ...props
}: { tag: string; onButtonClick: () => void } & React.ComponentProps<'div'>) {
  return (
    <Badge
      className={cn(
        'pointer-events-none pr-1 font-sans text-sm font-normal hover:bg-primary',
        className,
      )}
      {...props}
    >
      {tag}
      <Button
        className="pointer-events-auto h-5 w-7"
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => onButtonClick()}
      >
        <CrossCircledIcon />
      </Button>
    </Badge>
  )
}
