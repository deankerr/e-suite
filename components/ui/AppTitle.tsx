import { AppLogo } from '@/components/icons/AppLogo'

export const AppTitle = (props: React.ComponentProps<'div'>) => {
  return (
    <div className="flex shrink-0 items-center gap-1.5" {...props}>
      <AppLogo className="w-5 text-accent-11" />
      <div className="text-xl font-semibold leading-none tracking-tight">
        e<span className="text-lg leading-none">⋆</span>suite
      </div>
    </div>
  )
}
