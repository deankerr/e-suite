import { forwardRef } from 'react'
import { Volume2Icon, VolumeXIcon } from 'lucide-react'

import { useAppStore } from '../providers/AppStoreProvider'
import { UIIconButton } from '../ui/UIIconButton'

type VoiceoverPlayToggleProps = {} & Partial<React.ComponentProps<typeof UIIconButton>>

export const VoiceoverPlayToggle = forwardRef<HTMLButtonElement, VoiceoverPlayToggleProps>(
  function VoiceoverPlayToggle({ ...props }, forwardedRef) {
    const autoplay = useAppStore((state) => state.voiceoverAutoplayEnabled)
    const toggleAutoplay = useAppStore((state) => state.voiceoverToggleAutoplay)
    const voiceoverStop = useAppStore((state) => state.voiceoverStop)

    return (
      <UIIconButton
        {...props}
        label="play/stop voiceovers"
        onClick={() => {
          toggleAutoplay()
          if (autoplay) voiceoverStop()
        }}
        ref={forwardedRef}
        color={autoplay ? undefined : 'gold'}
      >
        {autoplay ? (
          <Volume2Icon className="scale-[1.15]" />
        ) : (
          <VolumeXIcon className="scale-[1.15]" />
        )}
      </UIIconButton>
    )
  },
)
