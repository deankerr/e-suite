import { Label } from '@/app/components/ui/Label'
import { cn } from '@/lib/utils'
import { Heading, Switch } from '@radix-ui/themes'
import { forwardRef } from 'react'
import { useAutoplayAudioAtom } from '../audio/useAudio'

type VoiceoverControlsProps = {} & React.ComponentProps<'div'>

export const VoiceoverControls = forwardRef<HTMLDivElement, VoiceoverControlsProps>(
  function VoiceoverControls({ className, ...props }, forwardedRef) {
    const [autoplay, setAutoplay] = useAutoplayAudioAtom()
    return (
      <div {...props} className={cn('rounded border p-2', className)} ref={forwardedRef}>
        <div className="flex justify-between">
          <Heading size="2">Voiceover</Heading>

          <div className="flex items-center gap-2">
            <Label>Autoplay</Label>
            <Switch className="cursor-pointer" checked={autoplay} onCheckedChange={setAutoplay} />
          </div>
        </div>
      </div>
    )
  },
)
