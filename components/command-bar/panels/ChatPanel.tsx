import { Button } from '@radix-ui/themes'

import {
  FormControl,
  FormInputSelect,
  FormInputText,
  FormInputTextarea,
} from '@/components/command-bar/form/ParameterInputs'

export const ChatPanel = () => {
  // const { formAction } = useChatForm()
  const formAction = () => {}

  return (
    <div className="h-full rounded-lg bg-gray-2 p-2 font-mono text-xs">
      <form action={formAction} className="space-y-4">
        <FormControl>
          message
          <FormInputTextarea
            placeholder="A bird in the bush is worth two in my shoe..."
            name={'message'}
          />
        </FormControl>

        <div className="gap-4 flex-between">
          <div className="flex gap-2">
            <FormControl className="w-48">
              role
              <FormInputSelect
                name={'role'}
                defaultValue={'user'}
                items={['user', 'assistant', 'system']}
              />
            </FormControl>

            <FormControl className="w-fit min-w-32">
              name
              <FormInputText name="name" />
            </FormControl>
          </div>

          <Button variant="surface" size="3" className="w-32" type="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
