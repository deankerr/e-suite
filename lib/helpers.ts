import { usePathname } from 'next/navigation'

export const useSuitePath = () => {
  const pathname = usePathname()
  const [_, route1, route2, slug, msg] = pathname.split('/')
  const path = [route1, route2, slug, msg]
  const isThreadPath = route1 === 'suite' && route2 === 'threads'

  const suitePath = {
    path,
    slug: isThreadPath ? slug : undefined,
    msg: isThreadPath ? msg : undefined,
  }

  return suitePath
}
