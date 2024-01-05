import { Button, TextArea } from '@radix-ui/themes'

type CommandBarProps = {
  props?: any
}

export const CommandBar = ({ props }: CommandBarProps) => {
  return (
    <div className="fixed bottom-4 mx-auto w-full max-w-2xl rounded border border-gray-8 bg-background p-2 transition-all md:mr-80">
      <div className="flex items-end gap-2">
        <TextArea placeholder="Positive prompt" size="3" className="h-full w-72 grow" />
        <TextArea placeholder="Negative prompt" size="3" className="h-full w-72 grow" />
        <Button variant="surface" size="4">
          Go!
        </Button>
      </div>
    </div>
  )
}
