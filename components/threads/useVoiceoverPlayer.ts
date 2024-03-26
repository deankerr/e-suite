import { useEffect } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { useAppStore } from '../providers/AppStoreProvider'

import type { Message } from '@/convex/threads/threads'

export const useVoiceoverPlayer = (messages?: Message[]) => {
  const queue = useAppStore((state) => state.voiceoverMessageQueue)
  const setQueue = useAppStore((state) => state.voiceoverSetMessageQueue)
  const isAutoplayEnabled = useAppStore((state) => state.voiceoverIsAutoplayEnabled)

  const { load, src, stop, playing, isLoading } = useGlobalAudioPlayer()

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

  // stop anything playing that is no longer current, otherwise try to play something
  if (!currentId && playing) stop()
  else play()

  // update the queue if messages have changed
  useEffect(() => {
    const isStale = messages && messages.some(({ _id }, i) => _id !== queue?.[i]?.[0])
    if (!isStale) return

    setQueue(
      messages.map(({ _id }) => {
        // if queue is undefined (initial load), don't autoplay everything
        if (!queue || !isAutoplayEnabled) return [_id, false]
        // otherwise restore old status, or queue the new message for autoplay
        const status = queue.find(([id]) => id === _id)?.[1] ?? true
        return [_id, status]
      }),
    )
  }, [isAutoplayEnabled, messages, queue, setQueue])

  // cleanup
  useEffect(() => {
    return () => {
      setQueue(undefined)
      stop()
    }
  }, [setQueue, stop])
}
