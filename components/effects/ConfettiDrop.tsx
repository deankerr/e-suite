'use client'

import { useState } from 'react'
import { Portal } from '@radix-ui/themes'
import { useWindowSize } from '@uidotdev/usehooks'
import { button, useControls } from 'leva'
import ReactConfetti from 'react-confetti'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

const yay = '/audio/sc2k-yay.mp3'

export const ConfettiDropper = () => {
  const [confettis, setConfettis] = useState<[number, JSX.Element][]>(() => [])
  const { load } = useGlobalAudioPlayer()

  const triggerConfetti = () => {
    const id = Date.now()
    const newConfetti = (
      <ConfettiInstance
        id={id}
        key={id}
        onComplete={() => setConfettis((confettis) => confettis.filter(([cid]) => cid !== id))}
      />
    )
    setConfettis((confettis) => [...confettis, [id, newConfetti]])

    load(yay, {
      autoplay: true,
      format: 'mp3',
    })
  }

  useControls('confetti', {
    drop: button(triggerConfetti),
  })

  return confettis.map((confetti) => confetti[1])
}

const ConfettiInstance = ({ id, onComplete }: { id: number; onComplete: (id: number) => void }) => {
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
