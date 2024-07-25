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
      <div className="flex-start h-12 shrink-0 gap-3 rounded-lg border border-grayA-3 bg-grayA-2 px-2">
        <AppLogoName />
        <div className="font-semibold text-grayA-11">admin</div>
        <nav className="min-w-36">
          <AdminNav />
        </nav>

        <div className="flex-end shrink-0 grow">
          <UserButtons />
        </div>
      </div>

      {children}
    </Theme>
  )
}
