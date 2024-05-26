import { preloadQuery } from 'convex/nextjs'

import { ThreadBar } from '@/components/command-menu/ThreadBar'
import { UserButtons } from '@/components/layout/UserButtons'
import { AppLogoTitle } from '@/components/ui/AppLogoTitle'
import { api } from '@/convex/_generated/api'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const preloadedList = await preloadQuery(api.threads.query.listViewerThreads, {})
  return (
    <div className="flex flex-col">
      <header className="sticky flex h-11 items-center justify-between gap-2 border-b px-2">
        <AppLogoTitle />
        <ThreadBar preloadedList={preloadedList} />
        <UserButtons />
      </header>
      {children}
    </div>
  )
}
