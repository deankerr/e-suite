import { Spinner } from '@/components/ui/Spinner'

export default {
  Default: () => <Spinner />,
  Dots: () => <Spinner variant="dots" />,
  Ball: () => <Spinner variant="ball" />,
  Bars: () => <Spinner variant="bars" />,
  Ping: () => <Spinner variant="ping" />,
  Infinity: () => <Spinner variant="infinity" />,
}
