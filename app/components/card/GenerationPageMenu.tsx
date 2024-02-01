'use client'

import { cn } from '@/lib/utils'
import { Card, Heading } from '@radix-ui/themes'
import { forwardRef } from 'react'
import { GenerationForm } from '../section/GenerationForm'

type Props = {}

export const GenerationPageMenu = forwardRef<
  HTMLDivElement,
  Props & React.ComponentProps<typeof Card>
>(function GenerationPageMenu({ className, ...props }, forwardedRef) {
  return (
    <Card
      {...props}
      className={cn('h-fit max-w-[100vw] place-self-center bg-panel-solid px-2 py-1', className)}
      ref={forwardedRef}
    >
      <div className="space-y-3">
        <Heading size="3" className="">
          Generate
        </Heading>
        <GenerationForm className="flex flex-col gap-3" />
      </div>
    </Card>
  )
})
