import { Theme } from '@radix-ui/themes'

import { AdminNav } from '@/app/admin/AdminNav'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoName } from '@/components/ui/AppLogoName'

export const metadata = {
  title: {
    template: 'admin / %s',
    default: 'admin',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Theme className="flex h-screen flex-col gap-2 p-3">
      <div className="fixed inset-0 bg-gradient-to-br from-orange-3 via-orange-1 to-violet-2"></div>
      <div className="h-12 shrink-0 gap-3 rounded-lg border border-grayA-3 bg-grayA-2 px-2 flex-start">
        <AppLogoName />
        <div className="font-semibold text-grayA-11">admin</div>
        <nav className="min-w-36">
          <AdminNav />
        </nav>

        <div className="shrink-0 grow flex-end">
          <UserButtons />
        </div>
      </div>

      {children}
    </Theme>
  )
}
