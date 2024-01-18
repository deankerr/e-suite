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
    <div
      id="navbar"
      className="sOFFhadow-[0px_30px_60px_-12px_rgba(0,0,0,0.9)] z-10 flex items-center justify-between gap-2 border-b border-gray-6 px-2"
    >
      <SidebarToggleButton className="left-sidebar-toggle" />

      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="e/drop logo" className="-mb-0.5 -mr-0.5 size-6 md:size-8" priority />
        <Heading as="h1" className="text-accent">
          e/drop
        </Heading>
      </Link>

      <div className="grow" />

      <SidebarToggleButton className="right-sidebar-toggle" />
    </div>
  )
}
