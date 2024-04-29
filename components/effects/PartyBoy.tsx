'use client'

import { useWindowSize } from '@uidotdev/usehooks'
import { button, useControls } from 'leva'
import ReactConfetti from 'react-confetti'

import { useConfetti } from './useConfetti'

// global special effect manager
export const PartyBoy = () => {
  const window = useWindowSize()
  const { playConfetti, confettiInstances } = useConfetti()

  useControls('partyboy', {
    confetti: button(() => playConfetti()),
  })

  return (
    <div className="pointer-events-none fixed inset-0">
      {confettiInstances.map(({ id, onComplete }) => (
        <ReactConfetti
          key={id}
          width={window.width || undefined}
          height={window.height || undefined}
          recycle={false}
          gravity={0.4}
          numberOfPieces={400}
          tweenDuration={6000}
          onConfettiComplete={onComplete}
        />
      ))}
    </div>
  )
}
