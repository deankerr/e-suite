import { Message } from '@/convex/threads/threads'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'

export const useVoiceoverPlayer = (messages: Message[]) => {
  const [queue, setQueue] = useState<string[]>([]) // message id
  const [playingIndex, setPlayingIndex] = useState(0)
  const currentUrl = messages.find((m) => m._id === queue[playingIndex])?.voiceover?.url

  const { load, cleanup, stop, playing, isLoading } = useAudioPlayer()

  useEffect(() => {
    const queueNext = () => {
      setPlayingIndex((index) => {
        if (index >= queue.length) return index
        return index + 1
      })
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
  }, [cleanup, currentUrl, load, playingIndex, queue.length])

  const enqueue = (messageIds: string[]) => {
    const newIds = messageIds.filter((id) => !queue.includes(id))
    setQueue((queue) => [...queue, ...newIds])
  }

  const clearQueue = () => {
    stop()
    setQueue([])
  }

  return { enqueue, clearQueue, queue, isActive: playing || isLoading }
}
