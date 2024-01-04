import { cn } from '@/lib/utils'
import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'

export const Logo = ({ className }: { className?: React.ComponentProps<'div'>['className'] }) => {
  return (
    <div className={cn('flex items-center gap-3 pl-0', className)}>
      <Image src={logo} alt="e/suite logo" className="size-12" priority />
      <h1 className="text-3xl font-semibold tracking-tighter">e/suite</h1>
    </div>
  )
}
