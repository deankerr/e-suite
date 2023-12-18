import { DarkThemeToggle, Sidebar } from 'flowbite-react'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi'
import { RxCodesandboxLogo, RxComponent1, RxHome } from 'react-icons/rx'

type AppSidebarProps = {
  props?: any
}
export const AppSidebar = ({ props }: AppSidebarProps) => {
  return (
    <Sidebar aria-label="Sidebar">
      <Sidebar.Logo
        href="/"
        img="/logo-sunset.svg"
        imgAlt="e/suite logo"
        className="tracking-tight"
      >
        e/suite
      </Sidebar.Logo>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={RxHome} className="font-medium">
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={RxComponent1} className="font-medium">
            Models
          </Sidebar.Item>
          <Sidebar.Collapse icon={RxCodesandboxLogo} label="Agents" className="font-medium">
            <Sidebar.Item href="#">Paddy</Sidebar.Item>
            <Sidebar.Item href="#">Kent</Sidebar.Item>
            <Sidebar.Item href="#">Angelica</Sidebar.Item>
            <Sidebar.Item href="#">Create new</Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="">
          <Sidebar.Item href="#" className="font-medium">
            Log In
          </Sidebar.Item>
          <Sidebar.Item href="#" className="font-medium">
            Sign Up
          </Sidebar.Item>
          <Sidebar.Item>
            <DarkThemeToggle />
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

type NavLinkProps = {
  props?: any
} & ComponentProps<typeof Link>
export const NavLink = ({ href }: NavLinkProps) => {
  return <Link href={href}></Link>
}

function _() {
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
