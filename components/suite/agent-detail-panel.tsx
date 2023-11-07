import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '../ui/button'

export function AgentDetailPanel({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex min-h-[2rem] items-center text-sm">
          Agent: Horus Model: OpenAI: GPT-3.5 Turbo Instruct Status: Online
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
  )
}

function ModelSelectDemo() {
  //
  return (
    <Select>
      <SelectTrigger className="inline-flex w-[450px]">
        <SelectValue placeholder="OpenAI: GPT-3.5 Turbo Instruct" />
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
