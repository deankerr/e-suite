import { Volume2Icon, VolumeXIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'
import { UIIconButton } from '../ui/UIIconButton'

type VoiceoverPlayToggleProps = {} & Partial<React.ComponentProps<typeof UIIconButton>>

export const VoiceoverPlayToggle = forwardRef<HTMLButtonElement, VoiceoverPlayToggleProps>(
  function VoiceoverPlayToggle({ ...props }, forwardedRef) {
    const isAutoplayEnabled = useAppStore((state) => state.voiceoverIsAutoplayEnabled)
    const toggleIsAutoplayEnabled = useAppStore((state) => state.voiceoverToggleIsAutoplayEnabled)
    const voiceoverStop = useAppStore((state) => state.voiceoverStop)

    return (
      <UIIconButton
        {...props}
        label="play/stop voiceovers"
        onClick={() => {
          toggleIsAutoplayEnabled()
          if (isAutoplayEnabled) voiceoverStop()
        }}
        ref={forwardedRef}
        color={isAutoplayEnabled ? undefined : 'gray'}
      >
        {isAutoplayEnabled ? <Volume2Icon /> : <VolumeXIcon />}
      </UIIconButton>
    )
  },
)
