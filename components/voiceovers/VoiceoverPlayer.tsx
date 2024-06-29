import { useEffect, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'

import { api } from '@/convex/_generated/api'
import { EMessage } from '@/convex/shared/types'
import { hasActiveJobName } from '@/convex/shared/utils'
import { voiceoverQueueAtom } from '@/lib/atoms'

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
  const generateVoiceover = useMutation(api.db.voiceover.messageContent)
  const [shouldPlay, setShouldPlay] = useState(false)

  const { voiceover } = message
  const src = voiceover?.fileUrl

  const isAvailable =
    (message.content?.length ?? 0) > 0 &&
    !hasActiveJobName(message.jobs, 'inference/chat-completion')
  const isError = voiceover?.status === 'error'
  const isGenerating = voiceover?.status === 'pending'

  const [voiceoverQueue, setVoiceoverQueue] = useAtom(voiceoverQueueAtom)
  const shouldAutoplay = voiceoverQueue[0] === message._id

  const removeFromQueue = () => {
    setVoiceoverQueue((prev) => prev.filter((id) => id !== message._id))
  }

  useEffect(() => {
    setShouldPlay(shouldAutoplay)
  }, [shouldAutoplay])

  useEffect(() => {
    if (shouldPlay && !voiceover) {
      generateVoiceover({ messageId: message._id }).catch((err) => console.error(err))
    }
  }, [generateVoiceover, message._id, shouldPlay, voiceover])

  return (
    <>
      {shouldPlay && src ? (
        <AudioButton src={src} initialPlaying={shouldPlay} onEnd={removeFromQueue} {...props} />
      ) : isGenerating ? (
        <IconButton variant="ghost" size="1" onClick={() => setShouldPlay(!shouldPlay)} {...props}>
          <Icons.CircleNotch className="size-5 animate-spin" />
        </IconButton>
      ) : isAvailable ? (
        <IconButton
          variant="ghost"
          size="1"
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
      ) : (
        <IconButton variant="ghost" size="1" disabled {...props}>
          <Icons.SpeakerSlash className="size-5" />
        </IconButton>
      )}
    </>
  )
}
