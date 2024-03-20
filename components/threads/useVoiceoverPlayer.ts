import { Message } from '@/convex/threads/threads'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'

export const useVoiceoverPlayer = (messages: Message[]) => {
  const { cleanup, load, stop, isLoading, playing, src } = useAudioPlayer()
  const [sourceUrl, setSourceUrl] = useState('')
  const [lastPlayedUrl, setLastPlayedUrl] = useState('')

  console.log(src)
  const getNextSourceUrl = () => {
    const currentIndex = messages.findIndex((message) => message.voiceover?.url === sourceUrl)
    if (currentIndex === -1) return ''
    return messages[currentIndex + 1]?.voiceover?.url ?? ''
  }

  const nextUrl = getNextSourceUrl()

  useEffect(() => {
    if (!sourceUrl) return

    load(sourceUrl, {
      autoplay: true,
      format: 'mp3',
      onend: () => {
        setLastPlayedUrl(sourceUrl)
        setSourceUrl(nextUrl)
      },
    })

    return () => cleanup()
  }, [cleanup, load, nextUrl, sourceUrl])

  // useEffect(() => {

  // }, [])

  const voiceovers = messages.map((message) => {
    const job = message.voiceover?.job?.status
    const url = message.voiceover?.url

    const status = {
      isAvailable: !!url,
      isPlaying: sourceUrl === url && playing,
      isLoading: sourceUrl === url && isLoading,
      isPending: job === 'pending',
      isError: job === 'error',
    }

    const controls = {
      play: () => {
        if (url && !status.isPlaying) setSourceUrl(url)
      },
      stop: () => {
        stop()
        setSourceUrl('')
      },
    }

    return { ...status, ...controls }
  })

  return voiceovers
}
