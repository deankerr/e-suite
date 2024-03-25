import { Id } from '@/convex/_generated/dataModel'
import { Message } from '@/convex/threads/threads'
import { useEffect } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'
import { useAppStore } from '../providers/AppStoreProvider'

export const useVoiceoverPlayer = (messages?: Message[]) => {
  const queue = useAppStore((state) => state.voiceoverMessageQueue)
  const setQueue = useAppStore((state) => state.voiceoverSetMessageQueue)
  const isAutoplayEnabled = useAppStore((state) => state.voiceoverIsAutoplayEnabled)

  const { cleanup, load, src, stop, playing, isLoading } = useAudioPlayer()

  // "current" - first message with [Id, boolean = true]
  const currentIndex = queue?.findIndex(([_, status]) => status) ?? -1
  const [currentId] = queue?.[currentIndex] ?? []
  const currentUrl = messages?.find((message) => message._id === currentId)?.voiceover?.url
  const currentIsPlaying = playing && src === currentUrl

  const play = () => {
    if (!currentId) return // nothing to play
    if (currentIsPlaying) return // already playing
    if (isLoading) return
    if (!currentUrl) return // no voiceover yet (or error?)

    load(currentUrl, {
      autoplay: true,
      format: 'mp3',
      onend: () => setQueue(queue?.with(currentIndex, [currentId, false])),
    })
  }

  // are the current thread message ids different from the current queue
  const isQueueStale = (messages: Message[]) =>
    !queue || messages.some(({ _id }, i) => _id !== queue[i]?.[0])

  const rebuildQueue = (messages: Message[]) => {
    const newQueue: [Id<'messages'>, boolean][] = messages.map(({ _id }) => {
      // if this is the initial load, don't autoplay everything
      if (!queue || !isAutoplayEnabled) return [_id, false]
      // otherwise restore old status, or is a new message and should autoplay
      const status = queue.find(([id]) => id === _id)?.[1] ?? true
      return [_id, status]
    })

    setQueue(newQueue)
  }

  if (messages && isQueueStale(messages)) {
    rebuildQueue(messages)
  }

  if (!currentId && playing) {
    // if something is playing but nothing is queued, stop
    stop()
  } else {
    // otherwise see if we can play anything
    play()
  }

  // cleanup
  useEffect(() => {
    return () => {
      setQueue(undefined)
      cleanup()
    }
  }, [cleanup, setQueue])
}
