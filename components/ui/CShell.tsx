'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { atom, useAtom } from 'jotai'
import { PanelRightCloseIcon } from 'lucide-react'
import { createContext, forwardRef, useContext, useState } from 'react'
import { IconButton } from '../../app/components/ui/IconButton'

type RootProps = {}

const CShellContext = createContext<ReturnType<typeof createShellAtom> | null>(null)

const createShellAtom = () => {
  const valueAtom = atom({ left: false, right: true })
  const interfaceAtom = atom(
    (get) => get(valueAtom),
    (_, set, args: { left: boolean; right: boolean }) => {
      set(valueAtom, args)
    },
  )
  return interfaceAtom
}

const useShellContext = () => {
  const context = useContext(CShellContext)
  if (!context) throw new Error('useShellContext called outside of provider')
  return context
}

const Root = forwardRef<HTMLDivElement, RootProps & React.ComponentProps<'div'>>(function Root(
  { children, className, ...props },
  forwardedRef,
) {
  const [shellAtom] = useState(createShellAtom)

  return (
    <CShellContext.Provider value={shellAtom}>
      <div
        {...props}
        id="cshell-root"
        className={cn('flex h-full w-full divide-x overflow-hidden rounded border', className)}
        ref={forwardedRef}
      >
        {children}
      </div>
    </CShellContext.Provider>
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
        className={cn('grid overflow-hidden', width && 'shrink-0', className)}
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

type ContentProps = {}

export const Content = forwardRef<HTMLDivElement, ContentProps & React.ComponentProps<'div'>>(
  function Content({ children, className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        id="shell-content"
        className={cn('grow bg-panel-translucent', className)}
        ref={forwardedRef}
      >
        {children}
      </div>
    )
  },
)

const sidebarWidths = {
  384: 384,
  320: 320,
} as const

type LeftSidebarProps = { open?: boolean; width?: keyof typeof sidebarWidths }

export const LeftSidebar = forwardRef<
  HTMLDivElement,
  LeftSidebarProps & React.ComponentProps<'div'>
>(function LeftSidebar({ width = 320, children, className, ...props }, forwardedRef) {
  const shellAtom = useShellContext()
  const [shell] = useAtom(shellAtom)

  const spring = useSpring({
    width: shell.left ? width : 0,
  })
  return (
    <animated.div
      {...props}
      className={cn('shrink-0 bg-gray-1', className)}
      ref={forwardedRef}
      style={spring}
    >
      {children}
    </animated.div>
  )
})

type RightSidebarProps = { open?: boolean; width?: keyof typeof sidebarWidths }

export const RightSidebar = forwardRef<
  HTMLDivElement,
  RightSidebarProps & React.ComponentProps<'div'>
>(function RightSidebar({ width = 320, children, className, ...props }, forwardedRef) {
  const shellAtom = useShellContext()
  const [shell, setShell] = useAtom(shellAtom)

  const spring = useSpring({
    width: shell.right ? width : 0,
  })
  return (
    <animated.div
      {...props}
      className={cn('absolute right-0 h-full shrink-0 bg-gray-1', className)}
      ref={forwardedRef}
      style={spring}
    >
      <div className="flex h-10 items-center border-b">
        <IconButton
          variant="ghost"
          className="m-0"
          onClick={() => setShell({ ...shell, right: false })}
        >
          <PanelRightCloseIcon className="stroke-1" />
        </IconButton>
      </div>
      {children}
    </animated.div>
  )
})

export const CShell = Object.assign(
  {},
  { Root, Titlebar, Section, Content, LeftSidebar, RightSidebar },
)
