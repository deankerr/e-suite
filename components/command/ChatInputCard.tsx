import { Button, RadioCards, TextField } from '@radix-ui/themes'

import { Label } from '../ui/Label'
import { ModelTile } from './ModelTile'
import { Textarea } from './Textarea'

type ChatInputCardProps = { props?: unknown }

export const ChatInputCard = ({}: ChatInputCardProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-0.5">
          <Label className="font-mono">role</Label>
          <RadioCards.Root columns="3" gap="3" defaultValue="user">
            <RadioCards.Item value="user">User</RadioCards.Item>
            <RadioCards.Item value="assistant">AI</RadioCards.Item>
            <RadioCards.Item value="system">System</RadioCards.Item>
          </RadioCards.Root>
        </div>

        <div className="grid gap-0.5">
          <Label className="font-mono">name</Label>
          <TextField.Root size="3" />
        </div>
      </div>

      <div className="grid gap-0.5">
        <Label className="font-mono">message</Label>
        <Textarea rows={5} />
      </div>

      <div className="flex justify-between">
        <ModelTile model="llama" />

        <div className="grid items-end gap-4">
          <div></div>
          <Button variant="surface" size="4">
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
