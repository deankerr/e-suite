import { cn } from '@/lib/utils'
import logo from '/assets/icons/icon4.svg'
import Image from 'next/image'
import Link from 'next/link'

export function SuiteAppTitle({ className }: React.ComponentProps<'div'>) {
  return (
    <Link
      className={cn(
        'mr-4 flex items-center justify-center gap-2 pr-10 text-xl font-semibold tracking-tight',
        className,
      )}
      href="/"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image src={logo} alt="e/suite logo" />
      {/* <img src="/icons/icon4.svg" alt="abstract icon" width="40" /> */}
      <h1 className="pb-2">e/suite</h1>
    </Link>
  )
}
