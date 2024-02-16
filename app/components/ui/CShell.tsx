'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { WifiIcon } from 'lucide-react'
import { createContext, forwardRef, useContext, useEffect, useState } from 'react'
import { IconButton } from './IconButton'

type RootProps = {
  showLoadingState?: boolean
}

const initialContext = { showLoadingState: false }

const CShellContext = createContext(initialContext)

const Root = forwardRef<HTMLDivElement, RootProps & React.ComponentProps<'div'>>(function Root(
  { showLoadingState = false, children, className, ...props },
  forwardedRef,
) {
  const [shellState, setShellState] = useState({ showLoadingState })

  useEffect(() => {
    if (showLoadingState !== shellState.showLoadingState) setShellState({ showLoadingState })
  }, [showLoadingState, shellState.showLoadingState])

  return (
    <CShellContext.Provider value={shellState}>
      <div
        {...props}
        id="cshell-root"
        className={cn('flex min-h-96 w-full divide-x overflow-hidden rounded border', className)}
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
    const { showLoadingState } = useContext(CShellContext)

    return (
      <div
        {...props}
        id="cshell-titlebar"
        className={cn('flex h-8 items-center border-b bg-gray-1 px-1 text-sm', className)}
        ref={forwardedRef}
      >
        {icon && (
          <IconButton variant="ghost" className="m-0 -ml-1">
            {showLoadingState ? <WifiIcon className="size-5 animate-pulse stroke-1" /> : icon}
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

export const CShell = Object.assign({}, { Root, Titlebar, Section })
