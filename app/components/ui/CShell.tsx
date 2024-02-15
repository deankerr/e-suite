'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { forwardRef } from 'react'
import { IconButton } from './IconButton'

type RootProps = {}

const Root = forwardRef<HTMLDivElement, RootProps & React.ComponentProps<'div'>>(function Root(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={cn('flex min-h-96 divide-x overflow-hidden rounded border', className)}
      ref={forwardedRef}
    >
      {children}
    </div>
  )
})

type TitlebarProps = { icon?: React.ReactNode }

export const Titlebar = forwardRef<HTMLDivElement, TitlebarProps & React.ComponentProps<'div'>>(
  function Titlebar({ icon, children, className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        className={cn('flex h-8 items-center border-b bg-gray-1 px-1 text-sm', className)}
        ref={forwardedRef}
      >
        {icon && (
          <IconButton variant="ghost" className="m-0 -ml-1">
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
  function Section({ open = true, side, width, children, className, ...props }, forwardedRef) {
    const spring = useSpring({
      width: width ? (open ? width : 0) : '100%',
    })

    return (
      <animated.div
        {...props}
        className={cn(
          'overflow-hidden',
          width && 'absolute h-full shrink-0',
          side === 'right' && 'right-0',
          className,
        )}
        ref={forwardedRef}
        style={spring}
      >
        <div style={{ width }} className="text-sm">
          {children}
        </div>
      </animated.div>
    )
  },
)

export const CShell = Object.assign({}, { Root, Titlebar, Section })
