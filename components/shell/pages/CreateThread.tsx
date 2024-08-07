import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useAtomValue } from 'jotai'

import { ComposerPrev } from '@/components/composer/ComposerPrev'
import { shellSelectedModelAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import { useShellStack } from '@/components/shell/hooks'
import { defaultRunConfigChat } from '@/convex/shared/defaults'

export const CreateThread = () => {
  const stack = useShellStack()

  const selectedModel = useAtomValue(shellSelectedModelAtom)

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
          <div className="grow text-right text-xs text-gray-10">{selectedModel?.endpoint}</div>
        </CmdK.Item>
      </CmdK.Group>
      <CmdK.Separator />

      <ComposerPrev initialRunConfig={defaultRunConfigChat} className="pt-1" />
    </>
  )
}
