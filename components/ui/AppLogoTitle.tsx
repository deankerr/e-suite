import NextLink from 'next/link'

import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

type AppLogoTitleProps = Partial<React.ComponentProps<typeof NextLink>>

export const AppLogoTitle = ({ className, ...props }: AppLogoTitleProps) => {
  return (
    <NextLink href="/" {...props} className={cn('shrink-0', className)}>
      <div className="gap-1 flex-start">
        <Logo />
        <h1 className="flex-none text-xl font-semibold tracking-tight">e/suite</h1>
      </div>
    </NextLink>
  )
}
