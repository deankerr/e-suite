import { Id } from '@/convex/_generated/dataModel'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

type QueuedAudio = {
  messageId: Id<'messages'>
  url: string
  played: boolean
}

const audioIdUrlQueueAtom = atom<QueuedAudio[]>([])

const autoplayAudioAtom = atom(true)
export const useAutoplayAudioAtom = () => useAtom(autoplayAudioAtom)

// const enqueueAudioAtom = atom(
//   (get) => get(audioIdUrlQueueAtom),
//   (get, set, audio: QueuedAudio | QueuedAudio[]) => {
//     if (Array.isArray(audio)) set(audioIdUrlQueueAtom, (queue) => [...queue, ...audio])
//     else set(audioIdUrlQueueAtom, (queue) => [...queue, audio])
//   },
// )

const enqueueAudioAtom2 = atom(
  (get) => get(audioIdUrlQueueAtom),
  (get, set, audio: QueuedAudio | QueuedAudio[]) => {
    const queue = get(audioIdUrlQueueAtom)
    const audios = Array.isArray(audio) ? audio : [audio]
    const toAdd = audios.filter((audio) => !queue.find((qa) => qa.url === audio.url))
    if (toAdd.length) set(audioIdUrlQueueAtom, [...queue, ...toAdd])
  },
)

export const useEnqueueAudio = () => useAtom(enqueueAudioAtom2)

export const usePlayAudio = () => {
  const [queue, set] = useAtom(audioIdUrlQueueAtom)

  const playAudio = (url: string) => {
    const index = queue.findIndex((audio) => audio.url === url)
    if (index === -1) return
    set(
      queue.map((audio, i) =>
        i === index ? { ...audio, played: false } : { ...audio, played: true },
      ),
    )
  }

  return playAudio
}

export const useAudio = () => {
  const [queue, set] = useAtom(audioIdUrlQueueAtom)
  const currentAudio = queue.find((audio) => !audio.played)
  const currentSrc = currentAudio?.url

  const { load } = useGlobalAudioPlayer()

  useEffect(() => {
    if (!currentSrc) return
    load(currentSrc, {
      autoplay: true,
      format: 'mp3',
      onend: () => {
        set((queue) => {
          const currentIndex = queue.findIndex((audio) => audio.url === currentSrc)
          return queue.map((audio, i) => (i === currentIndex ? { ...audio, played: true } : audio))
        })
      },
    })
  }, [load, currentSrc, set])

  return { queue, currentAudio, currentSrc }
}
