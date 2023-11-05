import { InnerTabBar } from '@/components/chat/inner-tab-bar'
import { authServerProtected } from '@/lib/db'

export default async function ChatTabLayout({
  params,
  children,
}: {
  params: { slug: string }
  children: React.ReactNode
}) {
  const { chatTab } = await authServerProtected({ chatTabSlug: params.slug })

  return (
    <main className="grid grid-rows-[minmax(5rem,auto)_1fr] overflow-hidden">
      <div className="grid grid-rows-[1fr_auto] border-b px-2 pt-2">
        {/* grid upper row */}
        <div className="text-xs text-muted-foreground">
          {chatTab?.title} {chatTab?.engineId}
        </div>

        {/* grid lower row */}
        <InnerTabBar chatTab={chatTab} />
      </div>
      <div className="overflow-y-auto overflow-x-hidden">{children}</div>
    </main>
  )
}
