import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'
import { PlayIcon, StopCircleIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { api } from '@/convex/_generated/api'
import { EMessage } from '@/convex/shared/types'
import { getConvexSiteUrl } from '@/lib/utils'

export const VoiceoverButton = ({ message }: { message: EMessage }) => {
  const { load, src, playing, stop } = useGlobalAudioPlayer()

  const generateSpeech = useMutation(api.db.speech.generate)
  const speechUrl = message.speech
    ? `${getConvexSiteUrl()}/speech/${message.speech?._id}`
    : undefined

  const isPlaying = src === speechUrl && playing
  const isReady = message.speechId
  const isAvailable = (message.content?.length ?? 0) > 0

  const handleClick = () => {
    if (isPlaying) {
      stop()
      return
    }

    if (!isAvailable) return

    if (message.speech) {
      load(`${getConvexSiteUrl()}/speech/${message.speech?._id}`, {
        autoplay: true,
        format: 'mp3',
      })
      return
    }

    void generateSpeech({
      messageId: message._id,
      resourceKey: 'openai::alloy',
    })
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
      variant="ghost"
      color={message.speech ? 'green' : 'gray'}
      size="1"
      onClick={handleClick}
      disabled={!isAvailable}
    >
      <Icon className="size-5" />
    </IconButton>
  )
}
