import { Theme } from '@radix-ui/themes'

import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'

export const metadata = {
  title: {
    template: 'admin / %s',
    default: 'admin',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Theme className="flex h-screen flex-col gap-2 overflow-hidden p-3">
      <div className="fixed inset-0 bg-gradient-to-br from-orange-3 via-orange-1 to-violet-2"></div>
      <div className="h-12 shrink-0 gap-3 rounded-lg border border-grayA-3 bg-grayA-2 px-2 flex-start">
        <AppLogoTitle />

        <div className="grow font-semibold text-grayA-11 flex-start">admin</div>

        <div className="shrink-0 flex-end">
          <UserButtons />
        </div>
      </div>
      {children}
    </Theme>
  )
}
