import { forwardRef } from 'react'
import { Volume2Icon, VolumeXIcon } from 'lucide-react'

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
        color={isAutoplayEnabled ? undefined : 'gold'}
      >
        {isAutoplayEnabled ? (
          <Volume2Icon className="scale-[1.15]" />
        ) : (
          <VolumeXIcon className="scale-[1.15]" />
        )}
      </UIIconButton>
    )
  },
)
