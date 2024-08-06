import { usePathname } from 'next/navigation'

export const useSuitePath = () => {
  const pathname = usePathname()
  const [_, route1, route2, slug, msg] = pathname.split('/')
  const segments = [route1, route2, slug, msg]
  const isThreadPath = route1 === 'suite' && route2 === 'threads'

  const suitePath = {
    pathname,
    segments,
    slug: isThreadPath ? slug : undefined,
    msg: isThreadPath ? msg : undefined,
  }

  return suitePath
}
