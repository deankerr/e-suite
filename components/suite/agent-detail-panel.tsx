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
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Button } from '../ui/button'
import { getAgent } from './actions'

export function AgentDetailPanel({
  agentId,
  className,
}: { agentId?: string } & React.ComponentProps<'div'>) {
  const { data, error, isFetched, status, fetchStatus } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => (agentId ? getAgent(agentId) : null),
  })

  const agent = data
  const imageSrc = agent?.image ? `/${agent.image}` : ''
  const debugString = agent ? `${agent.id} ${agent.name} ${agent.engineId}` : 'no agent selected'

  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex min-h-[2rem] items-center text-sm">
          {data ? data.name : 'no agent selected'}
          {error ? error.message : null}
        </div>
        <div className="space-x-2">
          <ModelSelectDemo placeholder={data?.engineId} />
          <Button variant="secondary">Rename</Button>
          <Button variant="default">Deploy</Button>
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
        <div className="flex min-h-[2rem] items-center text-xs">{debugString}</div>
      </div>
      <div className="px-6">
        <Image src={imageSrc} alt="agent avatar" width={200} height={200} className="" />
      </div>
    </div>
  )
}

/* 
<div className={cn('grid grid-cols-[1fr_auto] items-center', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex min-h-[2rem] items-center text-sm">
          Agent: Horus Model: OpenAI: GPT-3.5 Turbo Instruct Status: Online Agent: {} Model: OpenAI:
          GPT-3.5 Turbo Instruct Status: Online
        </div>
        <div className="space-x-2">
          <ModelSelectDemo />
          <Button variant="secondary">Rename</Button>
          <Button variant="default">Deploy</Button>
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
        <div className="flex min-h-[2rem] items-center text-xs">
          Agent: Horus Model: OpenAI: GPT-3.5 Turbo Instruct Status: Online
        </div>
      </div>
      <div className="px-6">
        <Image src="/mock_dp.png" alt="mock dp" width={200} height={200} className="" />
      </div>
    </div>
*/

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
