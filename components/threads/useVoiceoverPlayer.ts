import { Id } from '@/convex/_generated/dataModel'
import { Message } from '@/convex/threads/threads'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'

export type VoiceoverPlayer = ReturnType<typeof useVoiceoverPlayer>
export const useVoiceoverPlayer = (messages: Message[]) => {
  const [autoplay, setAutoplay] = useState(true)

  const [hasAutoplayed, setHasAutoplayed] = useState(() => messages.map((message) => message._id))

  const [playMessageId, setPlayMessageId] = useState<Id<'messages'> | null>(null)
  const playMessage = messages.find((message) => message._id === playMessageId)

  const autoplayMessage = autoplay
    ? messages.find((message) => !hasAutoplayed.includes(message._id))
    : null

  const sourceMessage = playMessage ?? autoplayMessage
  const sourceId = sourceMessage?._id
  const sourceUrl = sourceMessage?.voiceover?.url

  useEffect(() => {
    if (!autoplay) setHasAutoplayed(messages.map((message) => message._id))
  }, [autoplay, messages])

  const { cleanup, load, stop, isLoading, playing } = useAudioPlayer()
  useEffect(() => {
    if (!sourceUrl) return
    console.log('load', sourceId)
    load(sourceUrl, {
      autoplay: true,
      format: 'mp3',
      onend: () => {
        setPlayMessageId(null)
        if (sourceId) setHasAutoplayed((list) => [...list, sourceId])
      },
    })

    return () => cleanup()
  }, [cleanup, load, sourceUrl, sourceId])

  const statuses = messages.map((message) => {
    const job = message.voiceover?.job?.status
    const url = message.voiceover?.url
    const isCurrent = sourceUrl === url

    const status = {
      messageId: message._id,
      isAvailable: !!url,
      isPlaying: isCurrent && playing,
      isLoading: (isCurrent && isLoading) || job === 'pending',
      isError: job === 'error',
    }

    return status
  })

  return {
    autoplay,
    setAutoplay,
    statuses,
    play: (id: Id<'messages'>) => {
      setHasAutoplayed(messages.map((message) => message._id))
      setPlayMessageId(id)
    },
    stop: () => {
      stop()
      setHasAutoplayed(messages.map((message) => message._id))
      setPlayMessageId(null)
    },
  }
}
