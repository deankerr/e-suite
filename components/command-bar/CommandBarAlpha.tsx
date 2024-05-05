'use client'

import { forwardRef } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { MenuIcon, MicrowaveIcon } from 'lucide-react'

import { useCmbLayoutAtom } from '@/components/command-bar/alphaAtoms'
import { Glass } from '@/components/ui/Glass'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

type CommandBarAlphaProps = { props?: unknown } & React.ComponentProps<'div'>

export const CommandBarAlpha = forwardRef<HTMLDivElement, CommandBarAlphaProps>(
  function CommandBarAlpha(props, forwardedRef) {
    const cmbRailHeight = 80
    const bounceRoom = 18

    const [{ containerHeightPc, panelHeight, panelOpen, rounded }] = useCmbLayoutAtom()

    const variants = {
      open: {
        y: 0,
      },
      closed: {
        y: panelHeight - cmbRailHeight - bounceRoom,
      },
    }

    return (
      <div
        {...props}
        id="home"
        className={cn(
          'fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end overflow-hidden',
          rounded && 'rounded-xl',
        )}
        ref={forwardedRef}
        style={{ height: `${containerHeightPc}%` }}
      >
        <motion.div
          className="absolute w-full p-4 pb-24 pt-6"
          style={{ height: panelHeight }}
          variants={variants}
          animate={panelOpen ? 'open' : 'closed'}
        >
          <Glass
            barWidth={1}
            borderRadius={16}
            className="absolute inset-0 rounded-2xl border border-gold-5"
          />
          <div
            className={cn(
              'h-full rounded-lg border bg-gray-2',
              'gap-4 flex-col-center',
              !panelOpen && 'invisible',
            )}
          >
            <div className="mx-auto font-mono">
              image generation in progress <Spinner className="-mb-1.5" variant="ping" />
            </div>
          </div>
        </motion.div>

        <div className="m-4 h-14 rounded-lg border bg-gray-2 p-2">
          <ButtonRailInner />
        </div>
      </div>
    )
  },
)

const ButtonRailInner = () => (
  <div className="h-full flex-between">
    <div className="flex gap-2">
      <IconButton variant="surface" size="3">
        <MenuIcon />
      </IconButton>

      <Button variant="surface" size="3" className="font-mono text-sm">
        Chat
      </Button>
      <Button variant="surface" size="3" className="font-mono text-sm">
        Generate
      </Button>
    </div>

    <IconButton variant="surface" size="3">
      <MicrowaveIcon />
    </IconButton>
  </div>
)
