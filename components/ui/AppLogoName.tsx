import { LogoSvg } from '@/app/b/LogoSvg'
import { cn } from '@/lib/utils'

export const AppLogoName = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div {...props} className={cn('flex flex-none items-center gap-1', className)}>
      <LogoSvg className="-mb-px ml-0.5 mr-0.5 size-5 text-accent-11" />
      <div className="text-xl font-semibold leading-5 tracking-tight">e/suite</div>
    </div>
  )
}
