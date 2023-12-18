import { DarkThemeToggle, Sidebar } from 'flowbite-react'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi'
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
      <Component />
      <DarkThemeToggle />
    </div>
  )
}

type NavLinkProps = {
  props?: any
} & ComponentProps<typeof Link>
export const NavLink = ({ href }: NavLinkProps) => {
  return <Link href={href}></Link>
}

function Component() {
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="#" icon={HiInbox}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
