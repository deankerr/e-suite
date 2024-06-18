import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { PlayIcon, StopCircleIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { api } from '@/convex/_generated/api'
import { EMessage } from '@/convex/shared/types'
import { hasActiveJobName } from '@/convex/shared/utils'

export const VoiceoverButton = ({ message }: { message: EMessage }) => {
  const { load, src, playing, stop } = useGlobalAudioPlayer()
  const generateVoiceover = useMutation(api.db.voiceover.generate)

  const { voiceover } = message
  const url = voiceover?.fileUrl

  const isPlaying = src === url && playing
  const isReady = !!url
  const isAvailable =
    (message.content?.length ?? 0) > 0 &&
    !hasActiveJobName(message.jobs, 'inference/chat-completion')

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

  const Icon = isPlaying
    ? StopCircleIcon
    : isReady
      ? PlayIcon
      : isAvailable
        ? Volume2Icon
        : VolumeXIcon

  return (
    <IconButton
      variant="outline"
      color={isReady ? 'green' : 'gray'}
      size="1"
      onClick={handleClick}
      disabled={!isAvailable}
    >
      <Icon className="size-5" />
    </IconButton>
  )
}
