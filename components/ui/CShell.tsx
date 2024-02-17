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
        className={cn('flex h-full w-full overflow-hidden rounded border text-sm', className)}
        ref={forwardedRef}
      >
        {children}
      </div>
    </ShellContext.Provider>
  )
})

type ContentProps = {} & React.ComponentProps<'div'>
const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      id="shell-content"
      className={cn('flex h-full grow flex-col overflow-hidden bg-panel-translucent', className)}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

type SidebarProps = { side: 'left' | 'right' } & React.ComponentProps<'div'>
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { side, children, className, ...props },
  forwardedRef,
) {
  const [shell] = useShellContext()
  const width = side === 'left' ? shell.leftWidth : shell.rightWidth
  const floating = side === 'left' ? shell.leftFloating : shell.rightFloating
  const open = side === 'left' ? shell.leftOpen : shell.rightOpen

  const floatingPosition = side === 'left' ? 'right-0' : 'left-0'

  const spring = useSpring({
    width: open ? width : 0,
  })
  return (
    <animated.div
      {...props}
      id={`shell-sidebar-${side}`}
      className={cn(
        'h-full shrink-0 overflow-hidden bg-gray-1',
        floating && 'absolute z-10',
        floating && floatingPosition,
        open && side === 'left' ? 'border-r' : 'border-l',
        className,
      )}
      ref={forwardedRef}
      style={spring}
    >
      <div className={cn('absolute inset-y-0', floatingPosition)} style={{ width }}>
        {children}
      </div>
    </animated.div>
  )
})

type TitlebarProps = {} & React.ComponentProps<'div'>
const Titlebar = forwardRef<HTMLDivElement, TitlebarProps>(function Titlebar(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn('flex h-10 shrink-0 items-center border-b', className)}
      ref={forwardedRef}
    >
      {children}
    </div>
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

export const CShell = Object.assign({}, { Root, Content, Sidebar, Titlebar, SidebarToggle })
