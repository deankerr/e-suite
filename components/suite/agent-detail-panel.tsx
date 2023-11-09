import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loading } from '../ui/loading'
import { getSuiteUser } from './actions'

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

  const agent = user?.agents.find((a) => a.id === agentId)

  const debugInfo = (
    <div className="font-mono text-xs">AgentDetail {agent?.id ?? 'no agent selected'}</div>
  )

  return (
    <div className={cn('', className)}>
      {debugInfo}
      {agent ? (
        <div className="grid grid-cols-[1fr_auto] rounded-md border">
          <div className="space-y-4 p-6">
            <h3 className="text-lg font-semibold leading-none">
              {isPending && <Loading />}
              {agent.name}
            </h3>
            <div className="font-mono text-xs">
              ID: {agent.id} Created: {agent.createdAt.toLocaleDateString()}{' '}
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
