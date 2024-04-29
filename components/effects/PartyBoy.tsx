'use client'

import { useState } from 'react'
import { button, useControls } from 'leva'

import { ConfettiDrop } from './ConfettiDrop'
import { useSoundEffect } from './useSoundEffect'

// global special effect manager
export const PartyBoy = () => {
  const [confettis, setConfettis] = useState<[number, JSX.Element][]>(() => [])

  const { playSound } = useSoundEffect()

  const triggerConfetti = () => {
    const id = Date.now()
    const newConfetti = (
      <ConfettiDrop
        id={id}
        key={id}
        onComplete={() => setConfettis((confettis) => confettis.filter(([cid]) => cid !== id))}
      />
    )
    setConfettis((confettis) => [...confettis, [id, newConfetti]])
    playSound('yay')
  }

  useControls('partyboy', {
    confetti: button(triggerConfetti),
  })

  return confettis.map((confetti) => confetti[1])
}

// const ConfettiInstance = ({ id, onComplete }: { id: number; onComplete: (id: number) => void }) => {
//   const { width, height } = useWindowSize()
//   if (!width || !height) return null

//   return (
//     <Portal className="pointer-events-none fixed inset-0">
//       <ReactConfetti
//         width={width}
//         height={height}
//         gravity={0.4}
//         numberOfPieces={400}
//         tweenDuration={6000}
//         recycle={false}
//         onConfettiComplete={() => onComplete(id)}
//       />
//     </Portal>
//   )
// }
