import { Heading } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'
import Link from 'next/link'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  return (
    <div className="flex gap-2 border-b border-gray-6">
      <Link href="/" className="flex items-center gap-2 px-4">
        <Image src={logo} alt="e/drop logo" className="-mb-0.5 -mr-0.5 size-8" priority />
        <Heading size="7" as="h1" className="text-accent">
          e/drop
        </Heading>
      </Link>
    </div>
  )
}
