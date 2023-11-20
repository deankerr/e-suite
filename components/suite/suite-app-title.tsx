import { cn } from '@/lib/utils'
// import logo from '/assets/icons/icon4.svg'
import logo from '/assets/icons/sun-stripe2.svg'
import Image from 'next/image'
import Link from 'next/link'

export function SuiteAppTitle({ className }: React.ComponentProps<'div'>) {
  return (
    <Link className={cn('', className)} href="/">
      <Logo />
    </Link>
  )
}

export function Logo({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid w-28 grid-cols-2 place-content-center', className)}>
      <Image src={logo} alt="e/suite logo" className="w-12 max-w-[4rem]" priority />
      <h1 className="flex items-center text-xl font-semibold tracking-tight">e/suite</h1>
    </div>
  )
}
/* style={{ boxShadow: '0 0 30px rgba(246,147,26,0.5' }} */
