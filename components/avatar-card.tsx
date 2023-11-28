import { Deck } from '@/components/deck'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { AgentDetail } from '@/schema/user'
import { useRef, useState } from 'react'
import { DeleteAgentDialog } from './delete-agent-dialog'
import { useUpdateAgent } from './queries'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loading } from './ui/loading'

export function AvatarCard({
  agent,
  className,
}: { agent: AgentDetail } & React.ComponentProps<'div'>) {
  const updateAgent = useUpdateAgent(agent.id)
  const isPending = updateAgent.isPending
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Deck.Card className={cn('flex justify-between p-6', className)}>
      <Avatar className="h-24 w-24 rounded-lg">
        <AvatarImage src={'/' + agent.image} alt="avatar" />
        <AvatarFallback className="rounded-lg">?</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-end justify-between">
        {isEditing ? (
          <Input
            defaultValue={agent.name}
            className="text-right text-lg font-semibold"
            ref={inputRef}
          />
        ) : (
          <h2 className="text-lg font-semibold">{agent.name}</h2>
        )}

        <div className="flex gap-2">
          {isEditing ? (
            <Button
              variant="default"
              onClick={() => {
                if (
                  inputRef.current &&
                  inputRef.current.value !== '' &&
                  inputRef.current.value !== agent.name
                ) {
                  updateAgent.mutate({ name: inputRef.current.value })
                }
                setIsEditing(false)
              }}
            >
              Save
            </Button>
          ) : isPending ? (
            <Button variant="default">
              <Loading size="xs" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Rename
            </Button>
          )}
          <DeleteAgentDialog agent={agent}>
            <Button variant="outline" disabled={isEditing}>
              Delete
            </Button>
          </DeleteAgentDialog>
        </div>
      </div>
    </Deck.Card>
  )
}
