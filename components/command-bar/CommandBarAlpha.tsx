'use client'

import { forwardRef } from 'react'
import { Button, IconButton } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { MenuIcon, MicrowaveIcon } from 'lucide-react'
import { useMeasure } from 'react-use'

import { cmbHeightAtom, cmbOpenAtom, cmbTotalHeightAtom } from '@/components/command-bar/alphaAtoms'
import { Glass } from '@/components/ui/Glass'
import { cn } from '@/lib/utils'

type CommandBarAlphaProps = { props?: unknown } & React.ComponentProps<'div'>

export const CommandBarAlpha = forwardRef<HTMLDivElement, CommandBarAlphaProps>(
  function CommandBarAlpha(props, forwardedRef) {
    const [ref, { width, height }] = useMeasure<HTMLDivElement>()

    const [cmbOpen] = useAtom(cmbOpenAtom)
    const [cmbHeight] = useAtom(cmbHeightAtom)
    const [cmbTotalHeight] = useAtom(cmbTotalHeightAtom)

    const variants = {
      open: {
        y: '0%',
      },
      closed: {
        y: '100%',
      },
    }

    return (
      <div
        {...props}
        id="home"
        className={cn(
          'fixed left-1/2 top-0 flex w-full max-w-3xl -translate-x-1/2 flex-col justify-end',
        )}
        ref={forwardedRef}
        style={{ height: `${cmbTotalHeight}%` }}
      >
        {/* feature */}
        {/* tpanel masking container */}
        <div className="flex grow flex-col justify-end overflow-hidden">
          {/* motion div */}
          <motion.div
            variants={variants}
            animate={cmbOpen ? 'open' : 'closed'}
            style={{ height: cmbHeight }}
            className="p-4"
          >
            {/* glass bg */}
            <Glass borderRadius={12} barWidth={1} className="absolute inset-0 rounded-xl border" />
            {/* content */}
            <div className="h-full rounded-lg border border-gold-4 bg-gray-2 p-2 flex-between"></div>
          </motion.div>
        </div>

        {/* button rail */}
        <div className={cn('flex-none p-3', !cmbOpen && '')}>
          {/* glass bg */}
          <Glass borderRadius={12} barWidth={1} className="absolute inset-0 rounded-xl border" />
          <div className="rounded-lg border border-gold-4 bg-gray-2 p-1.5 flex-between">
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
        </div>

        {/* util */}
        <div ref={ref} className="absolute inset-0 font-mono text-xs text-gold-8">
          {width} {height}
        </div>
      </div>
    )
  },
)
