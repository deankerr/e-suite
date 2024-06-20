import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { useChat } from '@/components/chat/ChatProvider'
import { api } from '@/convex/_generated/api'
import { voiceoverQueueAtom } from '@/lib/atoms'

export const useVoiceoverPlayer = () => {
  const { load, src, isLoading } = useGlobalAudioPlayer()
  const generateVoiceover = useMutation(api.db.voiceover.generate)

  const { messages } = useChat()
  const [voiceoverQueue, setVoiceoverQueue] = useAtom(voiceoverQueueAtom)

  const currentMessageId = voiceoverQueue[0]
  const currentUrl = messages.data?.find((m) => m._id === currentMessageId)?.voiceover?.fileUrl
  const currentUrlIsLoaded = currentUrl === src

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
  }, [currentUrl, currentUrlIsLoaded, isLoading, load, setVoiceoverQueue])

  useEffect(() => {
    if (currentMessageId && !currentUrl) {
      generateVoiceover({ messageId: currentMessageId }).catch((err) => console.error(err))
    }
  }, [currentMessageId, currentUrl, generateVoiceover])
}
