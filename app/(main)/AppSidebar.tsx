'use client'

import { cn } from '@/lib/utils'
import { Button, DarkThemeToggle, Sidebar, type CustomFlowbiteTheme } from 'flowbite-react'
import { useState } from 'react'
import {
  LuBoxes,
  LuCherry,
  LuLogIn,
  LuLogOut,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuRocket,
} from 'react-icons/lu'
import { RxCodesandboxLogo, RxComponent1, RxHome } from 'react-icons/rx'

const theme: CustomFlowbiteTheme['sidebar'] = {
  root: {
    base: 'h-full shrink-0',
    inner:
      'h-full overflow-y-auto overflow-x-hidden rounded py-6 px-3 bg-gray-900 flex flex-col justify-between',
  },
}

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Sidebar aria-label="Sidebar" theme={theme} collapsed={collapsed}>
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
          <Sidebar.Item href="/" icon={RxHome} className="font-medium">
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/explore" icon={LuBoxes} className="font-medium">
            Explore
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
          <Sidebar.Item href="/ui-demo" icon={LuCherry} className="font-medium">
            UI Demo
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="">
          <Sidebar.Item href="#" icon={LuLogIn} className="font-medium">
            Log In
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={LuRocket} className="font-medium">
            Sign Up
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      <div className="grow" />
      <div className="flex flex-wrap items-end justify-center">
        <DarkThemeToggle />
        <Button
          color="gray"
          size="md"
          className="border-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <LuPanelLeftOpen className="h-5 w-5" />
          ) : (
            <LuPanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </Sidebar>
  )
}
