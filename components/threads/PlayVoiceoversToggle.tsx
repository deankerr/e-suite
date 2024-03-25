import { Volume2Icon, VolumeXIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'
import { UIIconButton } from '../ui/UIIconButton'

type PlayVoiceoversToggleProps = {} & Partial<React.ComponentProps<typeof UIIconButton>>

export const PlayVoiceoversToggle = forwardRef<HTMLButtonElement, PlayVoiceoversToggleProps>(
  function PlayVoiceoversToggle({ ...props }, forwardedRef) {
    const playVoiceovers = useAppStore((state) => state.playVoiceovers)
    const togglePlayVoiceovers = useAppStore((state) => state.togglePlayVoiceovers)

    return (
      <UIIconButton
        {...props}
        label="play/stop voiceovers"
        onClick={() => togglePlayVoiceovers()}
        ref={forwardedRef}
        color={playVoiceovers ? undefined : 'gray'}
      >
        {playVoiceovers ? <Volume2Icon /> : <VolumeXIcon />}
      </UIIconButton>
    )
  },
)
