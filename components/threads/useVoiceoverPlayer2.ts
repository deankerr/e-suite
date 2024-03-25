import { Message } from '@/convex/threads/threads'
import { useEffect } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'
import { useAppStore } from '../providers/AppStoreProvider'

export const useVoiceoverPlayer4 = (messages: Message[]) => {
  const queue = useAppStore((state) => state.voiceoverMessageQueue)
  const setQueue = useAppStore((state) => state.voiceoverSetMessageQueue)

  const isAutoplayEnabled = useAppStore((state) => state.voiceoverIsAutoplayEnabled)

  const { cleanup, load, src, stop, playing, isLoading } = useAudioPlayer()
  useEffect(() => {
    return () => {
      console.log('cleanup queue')
      setQueue(undefined)
      cleanup()
    }
  }, [cleanup, setQueue])

  const currentIndex = queue?.findIndex(([_, status]) => status) ?? -1
  const [currentId] = queue?.[currentIndex] ?? []
  const currentUrl = messages.find((message) => message._id === currentId)?.voiceover?.url
  const currentIsPlaying = playing && src === currentUrl

  const play = () => {
    if (!currentId) return console.log('play: queue empty')
    if (currentIsPlaying) return console.log('play: already playing')
    if (isLoading) return console.log('play: is loading')
    if (!currentUrl) return console.log('play: no voiceover url')

    console.log('play: load url')
    load(currentUrl, {
      autoplay: true,
      format: 'mp3',
      onend: () => setQueue(queue?.with(currentIndex, [currentId, false])),
    })
  }

  const isQueueStale = () => !queue || messages.some(({ _id }, i) => _id !== queue[i]?.[0])

  const rebuildQueue = () => {
    console.log('is queue undef', !queue, queue)
    console.log('msg', messages.length)

    setQueue(
      messages.map(({ _id }) => {
        if (!queue || !isAutoplayEnabled) [_id, false]
        const status = queue?.find(([id]) => id === _id)?.[1] ?? isAutoplayEnabled
        return [_id, status]
      }),
    )
  }

  if (isQueueStale()) {
    if (!queue) console.log('init queue')
    else console.log('stale')

    rebuildQueue()
  }

  if (currentId && !currentIsPlaying) play()
  if (!currentId && playing) {
    console.log('stop')
    stop()
  }
}
