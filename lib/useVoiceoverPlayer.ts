import { useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { useChat } from '@/components/chat/ChatProvider'
import { api } from '@/convex/_generated/api'
import { voiceoverAutoplayThreadIdAtom, voiceoverQueueAtom } from '@/lib/atoms'

export const useVoiceoverPlayer = (threadId?: string) => {
  const { load, src, isLoading, stop } = useGlobalAudioPlayer()
  const generateVoiceover = useMutation(api.db.voiceover.generate)

  const { messages } = useChat()
  const [voiceoverQueue, setVoiceoverQueue] = useAtom(voiceoverQueueAtom)

  const currentMessageId = voiceoverQueue[0]
  const currentUrl = messages.data?.find((m) => m._id === currentMessageId)?.voiceover?.fileUrl
  const currentUrlIsLoaded = currentUrl === src

  const latestMessageId = useRef('')
  const [autoplayThreadId] = useAtom(voiceoverAutoplayThreadIdAtom)
  const isAutoplay = threadId === autoplayThreadId

  useEffect(() => {
    if (currentUrl && !currentUrlIsLoaded && !isLoading) {
      load(currentUrl, {
        autoplay: true,
        format: 'mp3',
        onend: () => {
          setVoiceoverQueue((q) => q.slice(1))
        },
      })
    }

    if (!currentUrl) stop()
  }, [currentUrl, currentUrlIsLoaded, isLoading, load, setVoiceoverQueue, stop])

  useEffect(() => {
    if (currentMessageId && !currentUrl) {
      generateVoiceover({ messageId: currentMessageId }).catch((err) => console.error(err))
    }
  }, [currentMessageId, currentUrl, generateVoiceover])

  useEffect(() => {
    const last = messages.data?.at(-1)
    if (!last || !messages.data) return
    if (!latestMessageId.current) {
      latestMessageId.current = last._id
      return
    }
    if (latestMessageId.current !== last._id) {
      if (isAutoplay) {
        // enqueue all new messages after latestMessageId
        const newMessages = messages.data.slice(
          messages.data.findIndex((m) => m._id === latestMessageId.current) + 1,
        )
        setVoiceoverQueue((q) => [...q, ...newMessages.map((m) => m._id)])
      }

      latestMessageId.current = last._id
    }
  }, [isAutoplay, messages, setVoiceoverQueue])
}
