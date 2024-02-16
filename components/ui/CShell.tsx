'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from 'lucide-react'
import { forwardRef, useState } from 'react'
import { IconButton } from '../../app/components/ui/IconButton'
import { createShellContextAtom, ShellContext, useShellContext } from './shell.atoms'

type RootProps = {
  shellAtom?: ReturnType<typeof createShellContextAtom>
}

const Root = forwardRef<HTMLDivElement, RootProps & React.ComponentProps<'div'>>(function Root(
  { shellAtom, children, className, ...props },
  forwardedRef,
) {
  const [localShellAtom] = useState(() => createShellContextAtom())

  return (
    <ShellContext.Provider value={shellAtom ?? localShellAtom}>
      <div
        {...props}
        id="cshell-root"
        className={cn('flex h-full w-full divide-x overflow-hidden rounded border', className)}
        ref={forwardedRef}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
})

type TitlebarProps = { icon?: React.ReactNode }

export const Titlebar = forwardRef<HTMLDivElement, TitlebarProps & React.ComponentProps<'div'>>(
  function Titlebar({ icon, children, className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        id="cshell-titlebar"
        className={cn('flex h-8 items-center border-b bg-gray-1 px-1 text-sm', className)}
        ref={forwardedRef}
      >
        {icon && (
          <IconButton variant="ghost" className="m-0 -ml-1">
            {/* {showLoadingState ? <WifiIcon className="size-5 animate-pulse stroke-1" /> : icon} */}
            {icon}
          </IconButton>
        )}
        {children}
      </div>
    )
  },
)

type SectionProps = {
  open?: boolean
  side?: 'left' | 'right'
  width?: number
}

export const Section = forwardRef<HTMLDivElement, SectionProps & React.ComponentProps<'div'>>(
  function Section({ open = true, width, children, className, ...props }, forwardedRef) {
    const spring = useSpring({
      width: width ? (open ? width : 0) : '100%',
    })

    return (
      <animated.div
        {...props}
        id="cshell-section"
        className={cn('grid w-64 overflow-hidden', width && 'shrink-0', className)}
        ref={forwardedRef}
        style={spring}
      >
        <div style={{ width }} className="grid overflow-hidden text-sm">
          {children}
        </div>
      </animated.div>
    )
  },
)

type ContentProps = {
  titlebar?: React.ReactNode
}

export const Content = forwardRef<HTMLDivElement, ContentProps & React.ComponentProps<'div'>>(
  function Content({ titlebar, children, className, ...props }, forwardedRef) {
    const [_, setShell] = useShellContext()

    return (
      <animated.div
        {...props}
        id="shell-content"
        className={cn('grow bg-panel-translucent', className)}
        ref={forwardedRef}
      >
        <ATitlebar className="justify-between">
          <IconButton
            lucideIcon={PanelLeftOpenIcon}
            variant="ghost"
            className="m-0"
            onClick={() => setShell({ leftOpen: true })}
          />
          {titlebar}
          <IconButton
            lucideIcon={PanelRightOpenIcon}
            variant="ghost"
            className="m-0"
            onClick={() => setShell({ rightOpen: true })}
          />
        </ATitlebar>
        {children}
      </animated.div>
    )
  },
)

type LeftSidebarProps = { titlebar?: React.ReactNode }

export const LeftSidebar = forwardRef<
  HTMLDivElement,
  LeftSidebarProps & React.ComponentProps<'div'>
>(function LeftSidebar({ titlebar, children, className, ...props }, forwardedRef) {
  const [shell, setShell] = useShellContext()

  const spring = useSpring({
    width: shell.leftOpen ? shell.leftWidth : 0,
  })

  return (
    <animated.div
      {...props}
      id="shell-left-sidebar"
      className={cn(
        'h-full shrink-0 overflow-hidden bg-gray-1',
        shell.leftFloating && 'absolute left-0 z-10',
        className,
      )}
      ref={forwardedRef}
      style={{ width: spring.width }}
    >
      <div className="absolute right-0" style={{ width: shell.leftWidth }}>
        <ATitlebar>
          <IconButton
            lucideIcon={PanelLeftCloseIcon}
            variant="ghost"
            className="m-0"
            onClick={() => setShell({ leftOpen: false })}
          />
          {titlebar}
        </ATitlebar>
        <div>{children}</div>
      </div>
    </animated.div>
  )
})

type RightSidebarProps = { titlebar?: React.ReactNode }

export const RightSidebar = forwardRef<
  HTMLDivElement,
  RightSidebarProps & React.ComponentProps<'div'>
>(function RightSidebar({ titlebar, children, className, ...props }, forwardedRef) {
  const [shell, setShell] = useShellContext()

  const spring = useSpring({
    width: shell.rightOpen ? shell.rightWidth : 0,
  })
  return (
    <animated.div
      {...props}
      id="shell-right-sidebar"
      className={cn(
        'h-full shrink-0 overflow-hidden bg-gray-1',
        shell.rightFloating && 'absolute right-0 z-10',
        className,
      )}
      ref={forwardedRef}
      style={spring}
    >
      <div className="absolute left-0" style={{ width: shell.rightWidth }}>
        <ATitlebar>
          <IconButton
            lucideIcon={PanelRightCloseIcon}
            variant="ghost"
            className={cn('m-0')}
            onClick={() => setShell({ rightOpen: false })}
          />
          {titlebar}
        </ATitlebar>
        {children}
      </div>
    </animated.div>
  )
})

type ATitlebarProps = {}

const ATitlebar = forwardRef<
  HTMLDivElement,
  ATitlebarProps & React.ComponentProps<typeof animated.div>
>(function Titlebar({ children, className, ...props }, forwardedRef) {
  return (
    <animated.div
      {...props}
      className={cn('flex h-10 items-center border-b', className)}
      ref={forwardedRef}
    >
      {children}
    </animated.div>
  )
})

export const CShell = Object.assign(
  {},
  { Root, Titlebar, Section, Content, LeftSidebar, RightSidebar },
)
