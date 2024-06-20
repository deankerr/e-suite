import {
  CircleNotch,
  FileX,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Stop,
} from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { EMessage } from '@/convex/shared/types'
import { hasActiveJobName } from '@/convex/shared/utils'
import { voiceoverQueueAtom } from '@/lib/atoms'

export const VoiceoverButton = ({ message }: { message: EMessage }) => {
  const { src, playing, stop, isLoading, play } = useGlobalAudioPlayer()

  const { voiceover } = message
  const url = voiceover?.fileUrl

  const isError = voiceover?.status === 'error'
  const isPlaying = src === url && playing
  const isReady = !!url
  const isAvailable =
    (message.content?.length ?? 0) > 0 &&
    !hasActiveJobName(message.jobs, 'inference/chat-completion')
  const isGenerating = voiceover?.status === 'pending'

  const [voiceoverQueue, setVoiceoverQueue] = useAtom(voiceoverQueueAtom)
  const isCurrent = voiceoverQueue[0] === message._id || src === url
  const isEnqueued = voiceoverQueue.includes(message._id)

  const icon = isError ? (
    <FileX className="size-5" />
  ) : isPlaying ? (
    <Stop className="size-5" />
  ) : isGenerating || (isCurrent && isLoading) ? (
    <CircleNotch className="size-5 animate-spin" />
  ) : isReady ? (
    <Play className="size-5" />
  ) : isAvailable ? (
    <SpeakerHigh className="size-5" />
  ) : (
    <SpeakerSlash className="size-5" />
  )

  return (
    <IconButton
      variant="ghost"
      size="2"
      className="m-0"
      color={isEnqueued ? 'grass' : isCurrent ? 'green' : 'gray'}
      onClick={() => {
        if (isPlaying) return stop()
        if (isCurrent) return play()

        setVoiceoverQueue([message._id])
      }}
      disabled={isError || isGenerating || !isAvailable || (isCurrent && isLoading)}
    >
      {icon}
    </IconButton>
  )
}
