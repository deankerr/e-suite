import { SpeakerHifi } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useAtom, useSetAtom } from 'jotai'

import { voiceoverAutoplayThreadIdAtom, voiceoverQueueAtom } from '@/lib/atoms'

export const VoiceoverAutoplayButton = ({ threadId }: { threadId: string }) => {
  const [voiceoverAutoplayThreadId, setVoiceoverAutoplayThreadId] = useAtom(
    voiceoverAutoplayThreadIdAtom,
  )
  const setVoiceoverQueue = useSetAtom(voiceoverQueueAtom)
  const isAutoplaying = voiceoverAutoplayThreadId === threadId

  return (
    <IconButton
      variant="ghost"
      color={isAutoplaying ? 'green' : 'gray'}
      onClick={() => {
        if (isAutoplaying) {
          setVoiceoverAutoplayThreadId('')
          setVoiceoverQueue([])
          return
        }
        setVoiceoverAutoplayThreadId(threadId)
      }}
    >
      <SpeakerHifi className="size-5" />
    </IconButton>
  )
}
