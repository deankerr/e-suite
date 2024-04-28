import { Portal } from '@radix-ui/themes'
import { useWindowSize } from '@uidotdev/usehooks'
import ReactConfetti from 'react-confetti'

export const Confetti = () => {
  const { width, height } = useWindowSize()
  return width && height ? (
    <Portal>
      <ReactConfetti width={width} height={height} recycle={false} className="fixed" />
    </Portal>
  ) : null
}
