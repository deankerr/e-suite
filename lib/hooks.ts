import { useMedia } from 'react-use'

export const useTwMediaQuery = () => {
  return {
    sm: useMedia('(min-width: 520px)'),
    md: useMedia('(min-width: 768px)'),
    lg: useMedia('(min-width: 1024px)'),
    xl: useMedia('(min-width: 1280px)'),
    '2xl': useMedia('(min-width: 1640px)'),
  }
}
