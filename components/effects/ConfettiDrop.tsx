import { Portal } from '@radix-ui/themes'
import { useWindowSize } from '@uidotdev/usehooks'
import ReactConfetti from 'react-confetti'

export const ConfettiDrop = ({
  id,
  onComplete,
}: {
  id: number
  onComplete: (id: number) => void
}) => {
  const { width, height } = useWindowSize()
  if (!width || !height) return null

  return (
    <Portal className="pointer-events-none fixed inset-0">
      <ReactConfetti
        width={width}
        height={height}
        gravity={0.4}
        numberOfPieces={400}
        tweenDuration={6000}
        recycle={false}
        onConfettiComplete={() => onComplete(id)}
      />
    </Portal>
  )
}
