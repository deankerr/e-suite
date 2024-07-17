import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export const AppLogoName = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex flex-none items-center gap-1', className)}>
      <Logo className="-mb-px mr-px" />
      <div className="text-xl font-semibold leading-5 tracking-tight">e/suite</div>
    </div>
  )
}
