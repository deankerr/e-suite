import { usePathname } from 'next/navigation'

import { appConfig } from '@/config/config'

export const useSuitePath = () => {
  const pathname = usePathname()
  const [_, route1, route2, slug, msg] = pathname.split('/')
  const segments = [route1, route2, slug, msg]
  const isThreadPath = route1 === 'su' && route2 === 'thread'

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

export const getThreadPath = ({ slug, type = '' }: { type?: string; slug: string }) => {
  switch (type) {
    case 'chat':
      return `/chat/${slug}`
    case 'textToImage':
      return `/images/${slug}`
    default:
      return `/chat/${slug}`
  }
}
