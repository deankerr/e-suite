'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'

import { Navigation } from '@/components/navigation/Navigation'
import { IconButton } from '@/components/ui/Button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'

export const NavigationSheet = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="w-60 p-1">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Navigation className="w-full border-none hover:w-full" />
      </SheetContent>
    </Sheet>
  )
}

export const NavigationButton = () => {
  return (
    <NavigationSheet>
      <IconButton variant="ghost" aria-label="Open navigation sheet" className="md:invisible">
        <Icons.List size={20} />
      </IconButton>
    </NavigationSheet>
  )
}
