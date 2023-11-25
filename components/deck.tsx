'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { createContext, useContext, useState } from 'react'
import { Button } from './ui/button'

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
  return (
    <div
      className={cn(
        'space-y-2 bg-card p-6 text-card-foreground shadow',
        '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:leading-none',
        '[&_h3]:pb-2 [&_h3]:font-medium [&_h3]:leading-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

Deck.AvatarCard = function AvatarCard({
  imageSrc,
  className,
  children,
}: { imageSrc: string } & React.ComponentProps<'div'>) {
  const context = useDeckContext()

  return (
    <Deck.Card className={cn('flex justify-between', className)}>
      <Avatar className="h-24 w-24 rounded-lg">
        <AvatarImage src={imageSrc} alt="avatar" />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
      {children}
    </Deck.Card>
  )
}

const EditableCardContext = createContext({ isEditing: false })
export const useEditableCardContext = () => useContext(EditableCardContext)

Deck.EditableCard = function EditableCard({ className, children }: React.ComponentProps<'div'>) {
  const context = useDeckContext()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Deck.Card className={cn('relative', className)}>
      <Button
        variant={isEditing ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setIsEditing(!isEditing)}
        className="absolute right-5 top-5"
      >
        <Pencil1Icon />
      </Button>
      <EditableCardContext.Provider value={{ isEditing }}>{children}</EditableCardContext.Provider>
    </Deck.Card>
  )
}
