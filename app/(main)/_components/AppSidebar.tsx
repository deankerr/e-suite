import Link from 'next/link'
import { ComponentProps } from 'react'
import { Logo } from './Logo'

type AppSidebarProps = {
  props?: any
}
export const AppSidebar = ({ props }: AppSidebarProps) => {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4 bg-muted py-4">
      <Link href="/">
        <Logo />
      </Link>
      <div></div>
    </div>
  )
}

type NavLinkProps = {
  props?: any
} & ComponentProps<typeof Link>
export const NavLink = ({ href }: NavLinkProps) => {
  return <Link href={href}></Link>
}
