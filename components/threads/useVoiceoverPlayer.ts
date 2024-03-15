import { Message } from '@/convex/threads/threads'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'

export const useVoiceoverPlayer = (messages: Message[], autoplayNew = false) => {
  const [queue, setQueue] = useState<string[]>([]) // message id
  const [playingIndex, setPlayingIndex] = useState(0)
  const currentMessageId = queue[playingIndex]
  const currentUrl = messages.find((m) => m._id === queue[playingIndex])?.voiceover?.url

  const audioPlayer = useAudioPlayer()
  const { load, cleanup, stop } = audioPlayer

  useEffect(() => {
    const queueNext = () => {
      setPlayingIndex((index) => (index >= queue.length ? index : index + 1))
    }

    if (!currentUrl) {
      queueNext()
      return
    }

    load(currentUrl, {
      autoplay: true,
      format: 'mp3',
      onend: queueNext,
    })

    return () => cleanup()
  }, [cleanup, currentUrl, load, queue.length])

  useEffect(() => {
    if (!autoplayNew) return

    const newIds = messages
      .filter((msg) => msg.voiceover?.url)
      .map((msg) => msg._id)
      .filter((id) => !queue.includes(id))
      .reverse()
    if (!newIds.length) return

    setQueue((queue) => [...queue, ...newIds])
  }, [autoplayNew, messages, queue])

  const enqueue = (messageIds: string[]) => {
    const newIds = messageIds.filter((id) => !queue.includes(id))
    setQueue((queue) => [...queue, ...newIds])
  }

  const clearQueue = () => {
    stop()
    setQueue([])
    setPlayingIndex(0)
  }

  return {
    enqueue,
    clearQueue,
    queue,
    audioPlayer,
    currentMessageId,
    currentUrl,
    playingIndex,
  }
}
