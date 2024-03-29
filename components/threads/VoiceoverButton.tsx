import { forwardRef } from 'react'
import {
  FileWarningIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  PlayIcon,
  SquareIcon,
} from 'lucide-react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { UIIconButton } from '@/components/ui/UIIconButton'
import { useAppStore } from '../providers/AppStoreProvider'

import type { Message } from '@/convex/threads/threads'

type VoiceoverButtonProps = {
  message: Message
} & Partial<React.ComponentProps<typeof UIIconButton>>

export const VoiceoverButton = forwardRef<HTMLButtonElement, VoiceoverButtonProps>(
  function VoiceoverButton({ message, ...props }, forwardedRef) {
    const queuedIds = useAppStore((state) =>
      state.voiceoverAutoplayQueue?.slice(state.voiceoverAutoplayIndex),
    )

    const play = useAppStore((state) => state.voiceoverPlay)
    const stop = useAppStore((state) => state.voiceoverStop)

    const { speech } = message
    const { isLoading, playing, src } = useGlobalAudioPlayer()

    const isQueued = queuedIds?.includes(message._id)
    const isSource = src === speech?.url

    const getStatus = () => {
      if (isSource && playing) return 'playing'
      if (isSource && isLoading) return 'loading'
      if (speech?.status === 'pending' || speech?.status === 'inProgress') return 'loading'
      if (isQueued) return 'queued'
      if (speech?.status === 'failed' || speech?.status === 'canceled') return 'error'
      if (speech?.url) return 'ready'
      return 'request'
    }

    const status = getStatus()

    const statusIcons: Record<ReturnType<typeof getStatus>, React.ReactNode> = {
      playing: <SquareIcon />,
      queued: <MoreHorizontalIcon />,
      ready: <PlayIcon />,
      request: <PlayIcon />,
      loading: <Loader2Icon className="animate-spin" />,
      error: <FileWarningIcon />,
    }

    return (
      <UIIconButton
        {...props}
        label="play voiceover"
        ref={forwardedRef}
        color={status === 'request' ? 'gray' : undefined}
        onClick={() => {
          if (status === 'playing') stop()
          else play(message._id)
        }}
      >
        {statusIcons[status]}
      </UIIconButton>
    )
  },
)
