import { usePathname } from 'next/navigation'
import { useMedia } from 'react-use'

export const useTwMediaQuery = () => {
  return {
    sm: useMedia('(min-width: 520px)', false),
    md: useMedia('(min-width: 768px)', false),
    lg: useMedia('(min-width: 1024px)', false),
    xl: useMedia('(min-width: 1280px)', false),
    '2xl': useMedia('(min-width: 1640px)', false),
  }
}

export const useRouteData = () => {
  const pathname = usePathname()
  const [_, route, id] = pathname.split('/')
  const thread = route === 't' ? id : undefined
  return { thread }
}
