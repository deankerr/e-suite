import { Button, TextArea } from '@radix-ui/themes'

type CommandBarProps = {
  props?: any
}

export const CommandBar = ({ props }: CommandBarProps) => {
  return (
    <div className="fixed bottom-4 mx-auto w-full max-w-2xl rounded border border-gray-6 bg-background p-4 transition-all md:mr-80">
      <div className="flex h-20 items-end gap-2">
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
