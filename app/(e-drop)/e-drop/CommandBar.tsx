import { Button, TextArea } from '@radix-ui/themes'

type CommandBarProps = {
  props?: any
}

export const CommandBar = ({ props }: CommandBarProps) => {
  return (
    <div className="border-t border-gray-6 p-1">
      <div className="flex h-24 items-end gap-2">
        <TextArea
          placeholder="Positive prompt"
          size="1"
          className="h-full w-72 grow [&_textarea]:text-sm"
        />
        <TextArea
          placeholder="Negative prompt"
          size="1"
          className="h-full w-72 grow [&_textarea]:text-sm"
        />
        <Button variant="surface" size="4">
          Go!
        </Button>
      </div>
    </div>
  )
}
