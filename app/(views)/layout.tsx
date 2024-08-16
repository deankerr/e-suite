import { AppLogo } from '@/components/icons/AppLogo'

export const metadata = {
  title: 'eViews',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-midnight md:gap-1.5 md:p-1.5">
      <div className="flex-col-start w-11 rounded-md border bg-gray-1 py-2">
        <AppLogo className="size-6 text-accent-11" />
      </div>

      <div className="flex h-full w-full flex-col overflow-hidden border-gray-5 bg-gray-1 transition-colors md:rounded-md md:border">
        {children}
      </div>
    </div>
  )
}
