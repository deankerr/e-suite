import { AppLogo } from '@/components/icons/AppLogo'

export const AppTitle = (props: React.ComponentProps<'div'>) => {
  return (
    <div className="flex items-center gap-1" {...props}>
      <AppLogo className="-mb-0.5 w-5 text-accent-11" />
      <span className="text-xl font-semibold tracking-tight">e/suite</span>
    </div>
  )
}
