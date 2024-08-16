import { ThreadFavoriteButton } from '@/app/su/thread/[slug]/ThreadFavoriteButton'
import { ThreadMenu } from '@/app/su/thread/[slug]/ThreadMenu'
import { ThreadTitle } from '@/app/su/thread/[slug]/ThreadTitle'

export const metadata = {
  title: '',
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <>
      <header className="flex-start h-10 shrink-0 overflow-hidden border-b border-gray-5 bg-gray-2 px-1 font-medium">
        <div className="size-4" />
        <ThreadTitle slug={params.slug} />
        <ThreadMenu slug={params.slug} />
        <ThreadFavoriteButton slug={params.slug} />
      </header>
      {children}
    </>
  )
}
