import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const AppLogoName = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-none items-center gap-1 text-lg font-semibold tracking-tight',
        className,
      )}
    >
      <Logo className="size-[1.375rem] translate-y-[0.05rem]" />
      e/suite
    </div>
  )
}
