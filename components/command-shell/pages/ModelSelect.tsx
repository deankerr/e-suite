import * as Icons from '@phosphor-icons/react/dist/ssr'

import { CmdkGroup, CmdkItem } from '@/components/command-shell/components/Cmdk'

import type { ShellHelpers } from '@/components/command-shell/useCommandShell'

export const ModelSelect = ({
  shell,
  ...props
}: {
  shell: ShellHelpers
} & React.ComponentProps<typeof CmdkGroup>) => {
  const models = shell.inferenceType === 'chat' ? shell?.chatModels : shell?.imageModels
  const initialModel = models?.find((m) => m.resourceKey === shell.currentModel?.resourceKey)

  return (
    <CmdkGroup heading={`${shell.inferenceType} Models`} {...props}>
      {models?.map((model) => (
        <CmdkItem
          key={model._id}
          value={`${model.name} ${model.endpoint}`}
          onSelect={() => {
            shell.setModelKey(model.resourceKey)
            shell.pop()
          }}
        >
          {model.name}
        </CmdkItem>
      ))}
      <CmdkItem className="text-gray-11">
        <Icons.CaretLeft weight="light" />
        Back
      </CmdkItem>
    </CmdkGroup>
  )
}
