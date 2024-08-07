import { usePathname } from 'next/navigation'

import { appConfig } from '@/config/config'

export const useSuitePath = () => {
  const pathname = usePathname()
  const [_, route1, route2, slug, msg] = pathname.split('/')
  const segments = [route1, route2, slug, msg]
  const isThreadPath = route1 === 'suite' && route2 === 'threads'

  const threadPath = slug ? `${appConfig.threadUrl}/${slug}` : '/'
  const toThread = (slug: string) => `${appConfig.threadUrl}/${slug}`

  const suitePath = {
    pathname,
    segments,
    threadPath,
    toThread,
    slug: isThreadPath ? slug : undefined,
    msg: isThreadPath ? msg : undefined,
  }

  return suitePath
}
