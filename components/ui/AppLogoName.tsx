import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const AppLogoName = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex flex-none items-baseline gap-1', className)}>
      <Logo className="self-center" />
      <div className="text-xl font-semibold tracking-tight">e/suite</div>
    </div>
  )
}
