import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'

import { Composer } from '@/components/composer/Composer'
import { shellNewThreadInferenceConfig, shellSelectedModelAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useShellActions, useShellStack } from '@/components/shell/hooks'
import { appConfig } from '@/config/config'
import { defaultChatInferenceConfig } from '@/convex/shared/defaults'
import { useAppendMessage } from '@/lib/api'

export const CreateThread = () => {
  const router = useRouter()
  const stack = useShellStack()

  const shell = useShellActions()

  const { appendMessage, inputReadyState } = useAppendMessage()
  const selectedModel = useAtomValue(shellSelectedModelAtom)

  const newThreadInferenceConfig = useAtomValue(shellNewThreadInferenceConfig)

  if (stack.current !== 'CreateThread') return null
  return (
    <>
      <CmdK.Group>
        <CmdK.Item
          onSelect={() => {
            stack.push('ModelPicker')
          }}
        >
          <Icons.Cube weight="light" />
          {selectedModel?.name ?? 'Select model...'}
        </CmdK.Item>
      </CmdK.Group>
      <CmdK.Separator />

      <Composer
        model={selectedModel}
        runConfig={newThreadInferenceConfig ?? defaultChatInferenceConfig}
        appendMessage={appendMessage}
        inputReadyState={inputReadyState}
        onSuccess={(thread) => {
          router.push(`${appConfig.chatUrl}/${thread.slug}`)
          shell.close()
        }}
        className="pt-1"
      />
    </>
  )
}
