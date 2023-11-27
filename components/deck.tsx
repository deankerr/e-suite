'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { createContext, useContext, useState } from 'react'

const DeckContext = createContext({})
const useDeckContext = () => useContext(DeckContext)

export function Deck({ className, children }: React.ComponentProps<'div'>) {
  const [contextState, setContextState] = useState({})

  return (
    <Deck.Root initialValue={contextState}>
      <div className={cn('divide-y', className)}>{children}</div>
    </Deck.Root>
  )
}

Deck.Root = function DeckRoot({
  initialValue,
  children,
}: {
  initialValue: ReturnType<typeof useDeckContext>
  children: React.ReactNode
}) {
  return <DeckContext.Provider value={initialValue}>{children}</DeckContext.Provider>
}

Deck.Card = function Card({ className, children }: React.ComponentProps<'div'>) {
  return <div className={cn('bg-card text-card-foreground', className)}>{children}</div>
}

Deck.EditableCard = function EditableCard({
  className,
  children,
}: { hidebutton?: boolean } & React.ComponentProps<'div'>) {
  const context = useDeckContext()

  return <Deck.Card className={cn('relative', className)}>{children}</Deck.Card>
}

Deck.CardTitle = function CardTitle({ className, children }: React.ComponentProps<'h3'>) {
  return <h4 className={cn('p-6 pb-0 font-medium', className)}>{children}</h4>
}

Deck.CardBody = function CardBody({ className, children }: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-1.5 p-5 pt-2', className)}>{children}</div>
}

Deck.CardToolbar = function CardToolbar({ className, children }: React.ComponentProps<'div'>) {
  return <div className={cn('absolute right-0 flex gap-2 p-4', className)}>{children}</div>
}
