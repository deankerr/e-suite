import { SidebarToggleButton } from '@/app/components/SidebarToggle'
import { Heading } from '@radix-ui/themes'
import logo from '/assets/icons/logo-sunset.svg'
import Image from 'next/image'
import Link from 'next/link'

type NavbarProps = {
  props?: any
}

export const Navbar = ({ props }: NavbarProps) => {
  return (
    <nav className="left-4 top-2 z-50 flex items-center justify-between gap-2 place-self-start rounded border border-accent-2 bg-accent-1 px-2 py-2">
      {/* <SidebarToggleButton className="left-sidebar-toggle" /> */}

      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="e/drop logo" className="-mr-0.5 size-5" priority />
        {/* <Heading className="text-accent" size="4">
          top
        </Heading> */}
      </Link>

      {/* <div className="grow" /> */}

      <SidebarToggleButton className="right-sidebar-toggle" />
    </nav>
  )
}
