import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Agent } from '@/data/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDeleteAgent } from './queries'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Loading } from './ui/loading'

export function DeleteAgentDialog({
  children,
  agent,
}: {
  children: React.ReactNode
  agent: Agent
}) {
  const [open, setOpen] = useState(false)

  const deleteAgent = useDeleteAgent(agent.id)
  const [agentWasDeleted, setAgentWasDeleted] = useState(false)
  const { status } = deleteAgent
  const router = useRouter()

  if (status === 'error') setOpen(false)
  if (status === 'success' && !agentWasDeleted) {
    setAgentWasDeleted(true)
    setTimeout(() => router.push('/'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Agent</DialogTitle>
          <DialogDescription>Are you sure you want to delete {agent.name}?</DialogDescription>
        </DialogHeader>

        <Avatar className="mx-auto h-24 w-24 rounded-lg">
          <AvatarImage src={agent.image} alt="avatar" />
          <AvatarFallback className="rounded-lg">?</AvatarFallback>
        </Avatar>

        <DialogFooter className="sm:justify-start md:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          {status === 'idle' && (
            <Button variant="destructive" onClick={() => deleteAgent.mutate()}>
              Delete
            </Button>
          )}

          {status === 'pending' && (
            <Button variant="destructive">
              <Loading size="sm" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
