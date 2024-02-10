'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { useAtom } from 'jotai'
import { forwardRef, useEffect } from 'react'
import { getUiAtom } from '../atoms'
import { GenerationForm } from './GenerationForm'

type Props = {}

const GenerateDrawerElement = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function GenerateDrawerElement({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        className={cn(
          'absolute bottom-0 h-fit w-full border bg-panel-solid px-4 py-4 shadow-[0_-12px_16px_5px_rgba(0,0,0,0.3)]',
          className,
        )}
        ref={forwardedRef}
      >
        <GenerationForm className="flex flex-col gap-3" />
      </div>
    )
  },
)

type AProps = {}

export const GenerateDrawer = forwardRef<HTMLDivElement, AProps & React.ComponentProps<'div'>>(
  function GenerateDrawer({ className, ...props }, forwardedRef) {
    const positionClosed = { y: '88%' }
    const positionOpen = { y: '0%' }

    const [springs, api] = useSpring(() => positionClosed)
    const [generationDrawerOpen, toggle] = useAtom(getUiAtom('generationDrawerOpen'))

    const Drawer = animated(GenerateDrawerElement)

    useEffect(() => {
      if (!generationDrawerOpen) {
        void api.start({
          from: positionOpen,
          to: positionClosed,
        })
      } else {
        void api.start({
          from: positionClosed,
          to: positionOpen,
        })
      }
    }, [generationDrawerOpen])

    return (
      <>
        {generationDrawerOpen && (
          <div className="absolute top-0 h-full w-full bg-overlay" onClick={() => toggle(false)} />
        )}
        <Drawer {...props} ref={forwardedRef} style={springs} onClick={() => toggle(true)} />
      </>
    )
  },
)
