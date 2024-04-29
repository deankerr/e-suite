import { useEffect } from 'react'
import { buttonGroup, useControls } from 'leva'
import { useAudioPlayer } from 'react-use-audio-player'
import * as R from 'remeda'

const sounds = {
  yay: '/audio/sc2k-yay.mp3',
  boo: '/audio/sc2k-boo.mp3',
} as const

export const useSoundEffect = () => {
  const { load, cleanup } = useAudioPlayer()

  const playSound = (key: keyof typeof sounds) => {
    load(sounds[key], {
      autoplay: true,
    })
  }

  useControls('partyboy', {
    sounds: buttonGroup(R.mapValues(sounds, (_, key) => () => playSound(key))),
  })

  useEffect(() => {
    console.log('audio player loaded')
    return () => {
      console.log('audio player cleanup')
      cleanup()
    }
  }, [cleanup])

  return { playSound }
}
