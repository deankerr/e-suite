import { useEffect } from 'react'
import { buttonGroup, useControls } from 'leva'
import { useAudioPlayer } from 'react-use-audio-player'
import * as R from 'remeda'

const sounds = {
  yay: '/audio/sc2k-yay.mp3',
  boo: '/audio/sc2k-boo.mp3',
} as const

export const useSound = () => {
  const { load, cleanup } = useAudioPlayer()

  const playSound = (key: keyof typeof sounds) => {
    load(sounds[key], {
      autoplay: true,
      initialVolume: 0.3,
    })
  }

  useControls('partyboy', {
    sounds: buttonGroup(R.mapValues(sounds, (_, key) => () => playSound(key))),
  })

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return { playSound }
}
