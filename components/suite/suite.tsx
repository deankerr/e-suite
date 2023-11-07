'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  CaretDownIcon,
  CaretRightIcon,
  CircleIcon,
  RocketIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons'
import { Session } from 'next-auth/types'
import Image from 'next/image'
import { EngineInputControls } from '../chat/form/engine-input-controls'
import { Button } from '../ui/button'
import { Feed } from './feed'
import { TabBar } from './tab-bar'

export function Suite({ session }: { session: Session }) {
  return (
    <main className="grid grid-cols-[minmax(5rem,15%)_1fr] overflow-hidden">
      {/* menu/list */}
      <div className="grid grid-rows-[4rem_7rem_auto] border-r">
        <div></div>
        <div className="border-y"></div>
        <div className="p-3">
          <h6>
            <CaretDownIcon className="inline" /> Active
          </h6>
          <ul className="mb-4 pl-4">
            <li>
              <StarFilledIcon className="inline" /> Artemis
            </li>
            <li>
              <CircleIcon className="inline" /> Charon
            </li>
            <li>
              <RocketIcon className="inline" /> Dionysus
            </li>
            <li>
              <CircleIcon className="inline" /> Piñata
            </li>
          </ul>
          <h6>
            <CaretRightIcon className="inline" /> Other
          </h6>
        </div>
      </div>

      {/* main */}
      <div className="grid grid-rows-[3rem_minmax(5rem,auto)_1fr] overflow-hidden">
        <TabBar />

        {/* upper section */}
        <div className="grid grid-rows-[1fr_auto] border-b">
          <div className="flex items-center justify-around">
            <AgentControlDemo />
            <Image src="/mock_dp.png" alt="mock dp" width={200} height={200} className="" />
          </div>
          {/* inner tab bar */}
          <div className="w-full overflow-x-auto">
            <div
              className={cn(
                'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
                true && 'border-b-2 border-primary font-medium text-foreground opacity-100',
              )}
            >
              Message
            </div>
            <div
              className={cn(
                'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
                false && 'border-b-2 border-primary font-medium text-foreground opacity-100',
              )}
            >
              Parameters
            </div>
            <div
              className={cn(
                'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                'h-9 px-4 py-2 text-sm opacity-60 hover:opacity-100',
                true && 'border-b-2 border-primary font-medium text-foreground opacity-100',
              )}
            >
              Details
            </div>
          </div>
        </div>

        {/* main section */}
        <div className="grid grid-cols-[auto_40%] overflow-hidden">
          {/* messages */}
          <Feed className="overflow-y-auto border-r p-6 text-sm" />

          {/* params/settings */}
          <div className="space-y-6 overflow-y-auto p-6">
            <ParamPresetSelectDemo />
            <EngineInputControls />
          </div>
        </div>
      </div>
    </main>
  )
}

function ParamPresetSelectDemo() {
  //
  return (
    <div className="flex justify-between gap-1 rounded-md border">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt">Preset 1</SelectItem>
          <SelectItem value="cllama">Llama</SelectItem>
          <SelectItem value="orca">Alpaca</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">Save</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Delete</Button>
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

function AgentControlDemo() {
  return (
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
  )
}
