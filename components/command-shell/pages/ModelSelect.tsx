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

  return (
    <CmdkGroup
      heading={`${shell.inferenceType} models`}
      {...props}
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
          e.preventDefault()
          shell.pop()
        }
      }}
    >
      <CmdkItem
        value={`${shell.currentModel?.name} ${shell.currentModel?.endpoint}`}
        onSelect={() => {
          shell.pop()
        }}
      >
        <Icons.CaretLeft />
        {shell.currentModel?.name} (current)
      </CmdkItem>

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
