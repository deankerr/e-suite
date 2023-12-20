import { cn } from '@/lib/utils'
import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'

export const Logo = ({ className }: { className?: React.ComponentProps<'div'>['className'] }) => {
  return (
    <div className={cn('flex items-center', className)}>
      <Image src={logo} alt="e/suite logo" className="w-12" priority />
      <h1 className="pl-2 pr-2.5 text-xl font-semibold tracking-tight">e/suite</h1>
    </div>
  )
}
