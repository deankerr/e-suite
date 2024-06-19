import {
  CircleNotch,
  FileX,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Stop,
} from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { api } from '@/convex/_generated/api'
import { EMessage } from '@/convex/shared/types'
import { hasActiveJobName } from '@/convex/shared/utils'
import { cn } from '@/lib/utils'

export const VoiceoverButton = ({ message }: { message: EMessage }) => {
  const { load, src, playing, stop, isLoading } = useGlobalAudioPlayer()
  const generateVoiceover = useMutation(api.db.voiceover.generate)

  const { voiceover } = message
  const url = voiceover?.fileUrl

  const isError = voiceover?.status === 'error'
  const isPlaying = src === url && playing
  const isReady = !!url
  const isAvailable =
    (message.content?.length ?? 0) > 0 &&
    !hasActiveJobName(message.jobs, 'inference/chat-completion')
  const isGenerating = voiceover?.status === 'pending'

  const handleClick = () => {
    if (isPlaying) {
      stop()
      return
    }

    if (!isAvailable) return

    if (url) {
      load(url, {
        autoplay: true,
        format: 'mp3',
      })
      return
    }

    if (!voiceover) {
      void generateVoiceover({
        messageId: message._id,
      })
    }
  }

  const Icon = isError
    ? FileX
    : isPlaying
      ? Stop
      : isGenerating || isLoading
        ? CircleNotch
        : isReady
          ? Play
          : isAvailable
            ? SpeakerHigh
            : SpeakerSlash

  return (
    <IconButton
      variant="ghost"
      size="2"
      className="m-0"
      color="gray"
      onClick={handleClick}
      disabled={isError || isGenerating || !isAvailable}
    >
      <Icon className={cn('size-5', isGenerating && 'animate-spin')} />
    </IconButton>
  )
}
