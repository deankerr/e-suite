'use client'

import { Navigation } from '@/components/navigation/Navigation'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'

export const NavigationSheet = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" aria-describedby={undefined} className="w-64 p-1">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Navigation className="w-full border-none hover:w-full" />
      </SheetContent>
    </Sheet>
  )
}
