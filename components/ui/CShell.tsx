'use client'

import { cn } from '@/lib/utils'
import { animated } from '@react-spring/web'
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
        className={cn('flex h-full overflow-hidden bg-panel-translucent text-sm', className)}
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
      className={cn('flex h-full w-full grow flex-col', className)}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

type SidebarProps = { open?: boolean; side: 'left' | 'right' } & React.ComponentProps<'div'>
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { open, side, children, className, ...props },
  forwardedRef,
) {
  const isRight = side === 'right'

  return (
    <animated.div
      {...props}
      id={`shell-sidebar-${side}`}
      className={cn(
        'absolute right-0 flex h-full w-72 shrink-0 translate-x-72 flex-col bg-gray-1 transition-transform duration-300',
        'lg:static lg:translate-x-0',
        isRight ? 'border-l' : 'border-r',
        open && 'translate-x-0',
        className,
      )}
      ref={forwardedRef}
    >
      {children}
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
      className={cn('flex h-10 shrink-0 items-center border-b bg-gray-1', className)}
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
