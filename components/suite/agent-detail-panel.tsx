import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CopyIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loading } from '../ui/loading'
import { getSuiteUser, renameAgent } from './actions'

export function AgentDetailPanel({
  agentId,
  className,
}: { agentId: string } & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  if (error) {
    toast.error(error.message)
  }

  const queryClient = useQueryClient()

  const mutRename = useMutation({
    mutationKey: ['renameAgent'],
    mutationFn: (name: string) => renameAgent(agent?.id ?? '', name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const agent = user?.agents.find((a) => a.id === agentId)

  return (
    <div className={cn('', className)}>
      {agent ? (
        <div className="grid grid-cols-[1fr_auto] rounded-md border">
          <div className="space-y-4 p-6">
            {isPending && <Loading />}
            <div className="space-x-4">
              <h3 className="inline text-lg font-semibold leading-none">{agent.name}</h3>
              <RenameDialog current={agent.name} onSubmit={mutRename.mutate}>
                <Button variant="outline" size="sm" disabled={mutRename.isPending}>
                  {mutRename.isPending && <Loading size="xs" />}
                  Rename
                </Button>
              </RenameDialog>
            </div>
            <Input defaultValue={agent.name} />
            <div className="font-mono text-xs">
              ID: {agent.id} Created: {agent.createdAt.toLocaleDateString()}
              {agent.createdAt.toLocaleTimeString()}
            </div>
            {/* EngineCard */}
            <div className="space-x-2">
              <ModelSelectDemo placeholder={agent.engine.displayName} />
              <Button variant="secondary">Rename</Button>
              <Button variant="default">Deploy</Button>
              <Button variant="outline">Edit</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>

          <div className="">
            <Image src={`/${agent.image}`} alt="agent avatar" width={200} height={200} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ModelSelectDemo({ placeholder }: { placeholder?: string }) {
  //
  return (
    <Select>
      <SelectTrigger className="inline-flex w-[450px]">
        <SelectValue placeholder={placeholder ?? 'no agent selected'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt">OpenAI: GPT-3.5 Turbo Instruct</SelectItem>
        <SelectItem value="cllama">Meta: CodeLlama 34B Instruct (beta)</SelectItem>
        <SelectItem value="orca">OpenOrca Mistral (7B) 8K</SelectItem>
        <SelectItem value="red">RedPajama-INCITE Chat (3B)</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function RenameDialog({
  children,
  current,
  onSubmit,
}: {
  children: React.ReactNode
  current: string
  onSubmit: (value: string) => unknown
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  const submit = () => {
    const value = ref.current?.value
    if (!value) {
      console.log('no value')
      return
    }
    onSubmit(value)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Agent</DialogTitle>
          {/* <DialogDescription>Rename Agent</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="agent-name" className="sr-only">
              Name
            </Label>
            <Input ref={ref} id="agent-name" defaultValue={current} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={submit}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
