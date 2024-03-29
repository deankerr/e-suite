import { useEffect } from 'react'
import { useMutation } from 'convex/react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { useAppStore } from '../providers/AppStoreProvider'

import type { Id } from '@/convex/_generated/dataModel'
import type { Message } from '@/convex/threads/threads'

const useVoiceover = (message?: Message) => {
  const textToSpeech = useMutation(api.threads.threads.textToSpeech)
  const speechId = message?.speechId
  const messageId = message?._id

  useEffect(() => {
    if (speechId || !messageId) return
    async function send(messageId: Id<'messages'>) {
      try {
        await textToSpeech({ messageId })
      } catch (err) {
        console.error(err)
        toast.error('Failed to request voiceover.')
      }
    }

    void send(messageId)
  }, [messageId, speechId, textToSpeech])

  return message?.speech?.url
}

export const useVoiceoverPlayer = (messages?: Message[]) => {
  const messageId = useAppStore((state) => {
    if (state.voiceoverPlayingMessageId) return state.voiceoverPlayingMessageId
    const next = state.voiceoverAutoplayQueue?.[state.voiceoverAutoplayIndex]
    return next
  })
  const message = messages?.find((message) => message._id === messageId)

  const url = useVoiceover(message)

  const voiceoverEnqueueMessages = useAppStore((state) => state.voiceoverEnqueueMessages)
  const voiceoverEnded = useAppStore((state) => state.voiceoverEnded)
  const voiceoverCleanup = useAppStore((state) => state.voiceoverCleanup)

  const { load, stop } = useGlobalAudioPlayer()

  useEffect(() => {
    if (!url) {
      stop()
      return
    }

    load(url, {
      autoplay: true,
      format: 'mp3',
      onend: () => voiceoverEnded(),
    })
  }, [url, load, stop, voiceoverEnded])

  useEffect(() => {
    if (messages) {
      voiceoverEnqueueMessages(messages?.map((message) => message._id))
    }
  }, [messages, url, voiceoverEnqueueMessages])

  // cleanup
  useEffect(() => {
    return () => {
      console.log('cleanup')
      stop()
      voiceoverCleanup()
    }
  }, [stop, voiceoverCleanup])
}
