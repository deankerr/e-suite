import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Agent } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'
import { getAgent } from './actions'

const placeholderAgent: Agent = {
  id: 'id-placeholder-agent',
  name: 'Agent',
  image: 'dp0.png',
  ownerId: 'id-placeholder-owner',
  engineId: 'id-placeholder-engine',
  createdAt: new Date(),
  updatedAt: new Date(),
  parameters: {},
}

export function AgentDetailPanel({
  agentId,
  className,
}: { agentId: string } & React.ComponentProps<'div'>) {
  const {
    data: agent,
    error,
    isPending,
    isError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => (agentId ? getAgent(agentId) : placeholderAgent),
    placeholderData: placeholderAgent,
  })

  if (isError) {
    toast.error(error.message)
  }

  const debugString = error
    ? `Error: ${'error.message'}`
    : agent
    ? `${agent.id} ${agent.name} ${agent.engineId}`
    : 'no agent selected'

  const image = isPlaceholderData ? (
    <Loading />
  ) : agent?.image ? (
    <Image src={`/${agent.image}`} alt="agent avatar" width={200} height={200} className="h-auto" />
  ) : (
    <div className="w-[200px]" />
  )

  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center', className)}>
      <div className="flex flex-col gap-2">
        <div className="min-h-[2rem] text-sm">
          {isPlaceholderData ? <Loading /> : <p className="">{agent?.name}</p>}
        </div>
        <div className="space-x-2">
          <ModelSelectDemo placeholder={agent?.engineId} />
          <Button variant="secondary">Rename</Button>
          <Button variant="default">Deploy</Button>
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
        <div className="flex min-h-[2rem] items-center text-xs">{debugString}</div>
      </div>
      <div className="px-6">{image}</div>
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
