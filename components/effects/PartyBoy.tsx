'use client'

import { useWindowSize } from '@react-hookz/web'
import ReactConfetti from 'react-confetti'

import { useConfetti } from './useConfetti'

// global special effect manager
export const PartyBoy = () => {
  const window = useWindowSize()
  const { confettiInstances } = useConfetti()

  return confettiInstances.map(({ id, onComplete }) => (
    <div key={id} className="pointer-events-none fixed inset-0">
      <ReactConfetti
        width={window.width || undefined}
        height={window.height || undefined}
        recycle={false}
        gravity={0.4}
        numberOfPieces={400}
        tweenDuration={6000}
        onConfettiComplete={onComplete}
      />
    </div>
  ))
}
