import { useCallback, useEffect, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'

import { api } from '@/convex/_generated/api'
import { hasActiveJob } from '@/convex/shared/utils'
import { EMessage } from '@/convex/types'
import { voiceoverQueueAtom } from '@/lib/atoms'

import type { Id } from '@/convex/_generated/dataModel'

const AudioButton = dynamic(() => import('@/components/audio/AudioButton'), {
  ssr: false,
  loading: () => (
    <IconButton variant="ghost" size="1">
      <Icons.SpeakerHigh className="size-5" />
    </IconButton>
  ),
})

export const VoiceoverPlayer = ({
  message,
  ...props
}: { message: EMessage } & React.ComponentProps<typeof IconButton>) => {
  const generateVoiceover = useMutation(api.db.speech.messageText)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [speechId, setSpeechId] = useState<string | null>(null)
  const speech = useQuery(
    api.db.speech.get,
    speechId ? { speechId: speechId as Id<'speech'> } : 'skip',
  )

  const isAvailable =
    (message.text?.length ?? 0) > 0 && !hasActiveJob(message.jobs, 'inference/chat-completion')

  const isGenerating = hasActiveJob(message.jobs, 'inference/text-to-audio')
  const isError = false

  const [voiceoverQueue, setVoiceoverQueue] = useAtom(voiceoverQueueAtom)
  const shouldAutoplay = voiceoverQueue[0] === message._id

  const removeFromQueue = useCallback(() => {
    setVoiceoverQueue((prev) => prev.filter((id) => id !== message._id))
  }, [message._id, setVoiceoverQueue])

  useEffect(() => {
    setShouldPlay(shouldAutoplay)
  }, [shouldAutoplay])

  useEffect(() => {
    if (shouldPlay && !speechId) {
      generateVoiceover({ messageId: message._id })
        .then((result) => {
          setSpeechId(result)
        })
        .catch((err) => console.error(err))
    }
  }, [generateVoiceover, message._id, shouldPlay, speechId])

  useEffect(() => {
    if (shouldAutoplay && !isAvailable) {
      removeFromQueue()
    }
  }, [isAvailable, message._id, removeFromQueue, shouldAutoplay])

  return (
    <>
      {shouldPlay && speech?.fileUrl ? (
        <AudioButton
          src={speech.fileUrl}
          initialPlaying={shouldPlay}
          onEnd={removeFromQueue}
          {...props}
        />
      ) : isGenerating ? (
        <IconButton
          variant="ghost"
          size="1"
          color="gray"
          onClick={() => setShouldPlay(!shouldPlay)}
          {...props}
        >
          <Icons.CircleNotch className="size-5 animate-spin" />
        </IconButton>
      ) : isAvailable ? (
        <IconButton
          variant="ghost"
          size="1"
          color="gray"
          onClick={() => {
            setShouldPlay(true)
          }}
          {...props}
        >
          <Icons.SpeakerHigh className="size-5" />
        </IconButton>
      ) : isError ? (
        <IconButton variant="ghost" size="1" color="red" {...props}>
          <Icons.FileX className="size-5" />
        </IconButton>
      ) : null}
    </>
  )
}
