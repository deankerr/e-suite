import { useEffect } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'
import * as R from 'remeda'

const soundsSrc = {
  yay: '/audio/sc2k-yay.mp3',
  boo: '/audio/sc2k-boo.mp3',
} as const

export const useSound = () => {
  const { load, cleanup } = useAudioPlayer()

  const play = (key: keyof typeof soundsSrc) => {
    load(soundsSrc[key], {
      autoplay: true,
      initialVolume: 0.3,
    })
  }

  const playSound = R.mapValues(soundsSrc, (_, key) => () => play(key))

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return { playSound }
}
