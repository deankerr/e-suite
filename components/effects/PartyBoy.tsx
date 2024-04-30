'use client'

import { useWindowSize } from '@uidotdev/usehooks'
import { button, buttonGroup, useControls } from 'leva'
import ReactConfetti from 'react-confetti'

import { useConfetti } from './useConfetti'
import { useSound } from './useSound'

// global special effect manager
export const PartyBoy = () => {
  const window = useWindowSize()
  const { dropConfetti, confettiInstances } = useConfetti()
  const { playSound } = useSound()

  useControls(
    'partyboy',
    {
      confetti: button(() => dropConfetti()),
      sounds: buttonGroup(playSound),
    },
    { collapsed: true },
  )

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
