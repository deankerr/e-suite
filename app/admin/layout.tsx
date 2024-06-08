'use client'

import { Theme } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <Theme className="flex flex-col gap-1 p-3">
      <div className="fixed inset-0 bg-gradient-to-br from-orange-3 via-orange-1 to-violet-2"></div>
      <div className="h-12 gap-3 rounded-lg border border-grayA-3 bg-grayA-2 px-2 flex-start">
        <AppLogoTitle />

        <div className="font-semibold text-grayA-11 flex-start">{path.split('/').join(' / ')}</div>

        <div className="flex-end">
          <UserButtons />
        </div>
      </div>
      {children}
    </Theme>
  )
}
