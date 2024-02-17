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
} & React.ComponentProps<'div'>

const Root = forwardRef<HTMLDivElement, RootProps>(function Root(
  { shellAtom, children, className, ...props },
  forwardedRef,
) {
  const [localShellAtom] = useState(() => createShellContextAtom())

  return (
    <ShellContext.Provider value={shellAtom ?? localShellAtom}>
      <div
        {...props}
        id="cshell-root"
        className={cn(
          'flex h-full w-full divide-x overflow-hidden rounded border text-sm',
          className,
        )}
        ref={forwardedRef}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
})

type ContentProps = {
  titlebar?: React.ReactNode
} & React.ComponentProps<'div'>

export const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  { titlebar, children, className, ...props },
  forwardedRef,
) {
  const [_, setShell] = useShellContext()

  return (
    <animated.div
      {...props}
      id="shell-content"
      className={cn('flex h-full grow flex-col overflow-hidden bg-panel-translucent', className)}
      ref={forwardedRef}
    >
      <ATitlebar className="shrink-0">
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
})

type LeftSidebarProps = { titlebar?: React.ReactNode } & React.ComponentProps<'div'>

export const LeftSidebar = forwardRef<HTMLDivElement, LeftSidebarProps>(function LeftSidebar(
  { titlebar, children, className, ...props },
  forwardedRef,
) {
  const [shell] = useShellContext()

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
      <div className="absolute inset-y-0 right-0" style={{ width: shell.leftWidth }}>
        <ATitlebar>{titlebar}</ATitlebar>
        {children}
      </div>
    </animated.div>
  )
})

type RightSidebarProps = { titlebar?: React.ReactNode } & React.ComponentProps<'div'>

export const RightSidebar = forwardRef<HTMLDivElement, RightSidebarProps>(function RightSidebar(
  { titlebar, children, className, ...props },
  forwardedRef,
) {
  const [shell] = useShellContext()

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
      <div className="absolute inset-y-0 left-0" style={{ width: shell.rightWidth }}>
        <ATitlebar>{titlebar}</ATitlebar>
        {children}
      </div>
    </animated.div>
  )
})

type ATitlebarProps = {} & React.ComponentProps<typeof animated.div>

const ATitlebar = forwardRef<HTMLDivElement, ATitlebarProps>(function Titlebar(
  { children, className, ...props },
  forwardedRef,
) {
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

type SidebarToggleProps = { side: 'left' | 'right' } & React.ComponentProps<typeof IconButton>

export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarToggle({ side, className, ...props }, forwardedRef) {
    const [shell, setShell] = useShellContext()
    const sideLeftIcon = shell.leftOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon
    const sideRightIcon = shell.rightOpen ? PanelRightCloseIcon : PanelRightOpenIcon

    return (
      <IconButton
        lucideIcon={side === 'left' ? sideLeftIcon : sideRightIcon}
        {...props}
        className={cn('', className)}
        ref={forwardedRef}
        onClick={() => {
          if (side === 'left') setShell({ leftOpen: !shell.leftOpen })
          else setShell({ rightOpen: !shell.rightOpen })
        }}
      />
    )
  },
)

export const CShell = Object.assign({}, { Root, Content, LeftSidebar, RightSidebar, SidebarToggle })
