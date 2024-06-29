import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useMutation } from 'convex/react'

import { AudioButton } from '@/components/audio/AudioButton'
import { api } from '@/convex/_generated/api'
import { EMessage } from '@/convex/shared/types'
import { hasActiveJobName } from '@/convex/shared/utils'

export const VoiceoverPlayer = ({
  message,
  ...props
}: { message: EMessage } & React.ComponentProps<typeof IconButton>) => {
  const generateVoiceover = useMutation(api.db.voiceover.messageContent)
  const [shouldPlay, setShouldPlay] = useState(false)

  const { voiceover } = message
  const src = voiceover?.fileUrl

  const isAvailable =
    (message.content?.length ?? 0) > 0 &&
    !hasActiveJobName(message.jobs, 'inference/chat-completion')
  const isError = voiceover?.status === 'error'
  const isGenerating = voiceover?.status === 'pending'

  if (shouldPlay && src) {
    return <AudioButton src={src} initialPlaying={shouldPlay} {...props} />
  }

  if (isGenerating) {
    return (
      <IconButton variant="ghost" size="1" onClick={() => setShouldPlay(!shouldPlay)} {...props}>
        <Icons.CircleNotch className="size-5 animate-spin" />
      </IconButton>
    )
  }

  if (isAvailable) {
    return (
      <IconButton
        variant="ghost"
        size="1"
        onClick={() => {
          generateVoiceover({ messageId: message._id }).catch((err) => console.error(err))
          setShouldPlay(true)
        }}
        {...props}
      >
        <Icons.SpeakerHigh className="size-5" />
      </IconButton>
    )
  }

  if (isError) {
    return (
      <IconButton variant="ghost" size="1" color="red" {...props}>
        <Icons.FileX className="size-5" />
      </IconButton>
    )
  }

  return (
    <IconButton variant="ghost" size="1" disabled {...props}>
      <Icons.SpeakerSlash className="size-5" />
    </IconButton>
  )
}
