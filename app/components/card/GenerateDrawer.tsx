'use client'

import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { useAtom } from 'jotai'
import { forwardRef, useEffect } from 'react'
import { getUiAtom } from '../atoms'
import { GenerationForm } from '../section/GenerationForm'
import { TheSun } from '../ui/TheSun'
import { UserButton } from '../ui/UserButton'

type Props = {}

const GenerateDrawerElement = forwardRef<HTMLDivElement, Props & React.ComponentProps<'div'>>(
  function GenerateDrawerElement({ className, ...props }, forwardedRef) {
    return (
      <div
        {...props}
        className={cn(
          'h-fit w-full self-end justify-self-center border bg-panel-solid px-4 py-4 shadow-[0_-12px_16px_5px_rgba(0,0,0,0.3)]',
          className,
        )}
        ref={forwardedRef}
      >
        <GenerationForm className="flex flex-col gap-3" />
        <div className="flex justify-between">
          <TheSun />
          <UserButton className="" />
        </div>
      </div>
    )
  },
)

type AProps = {}

export const GenerateDrawer = forwardRef<HTMLDivElement, AProps & React.ComponentProps<'div'>>(
  function GenerateDrawer({ className, ...props }, forwardedRef) {
    const [springs, api] = useSpring(() => ({ y: '0%' }))
    const [generationDrawerOpen, toggle] = useAtom(getUiAtom('generationDrawerOpen'))

    const Drawer = animated(GenerateDrawerElement)

    useEffect(() => {
      if (!generationDrawerOpen) {
        void api.start({
          from: {
            y: '0%',
          },
          to: {
            y: '88%',
          },
        })
      } else {
        void api.start({
          from: {
            y: '88%',
          },
          to: {
            y: '0%',
          },
        })
      }
    }, [generationDrawerOpen])

    return (
      <>
        {generationDrawerOpen && <div className="bg-overlay" onClick={() => toggle(false)} />}
        <Drawer {...props} ref={forwardedRef} style={springs} onClick={() => toggle(true)} />
      </>
    )
  },
)
