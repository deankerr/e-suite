'use client'

import { AgentShell } from '@/components/agent-shell'
import { AppPanel } from '@/components/app-panel'
import { EngineCard } from '@/components/engine-card'
import { InferenceBuffer } from '@/components/inference-buffer/inference-buffer'
import { InferenceParameters } from '@/components/inference-parameters/Inference-parameters'
import { useAgentDetail } from '@/components/queries-reloaded'
import { SectionInferenceParameters } from '@/components/section-inference-parameters'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { schemaAgentParameters } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { useState } from 'react'

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agentSlug = params.slug
  const agent = useAgentDetail(agentSlug)
  const [paramEditMode, setParamEditMode] = useState(false)
  if (!agent.data) return <p>No agent?</p>

  // const parameters = schemaAgentParameters.parse(agent.data.parameters)

  // mock
  const parameters = [
    ['temperature', '1.0'],
    ['max_tokens', '1234'],
    ['frequency_penalty', '0.00'],
    ['presence_penalty', '0.00'],
    ['top_p', '1'],
    ['stop', 'USER:'],
  ]

  return (
    <AgentShell className="flex divide-x overflow-hidden">
      {/* Details */}
      <AppPanel className="w-full max-w-md">
        <AppPanel.Header imageStart={'/' + agent.data.image} title={agent.data.name}>
          {/* <Button variant="ghost" size="icon" className="">
            <Pencil1Icon />
          </Button> */}
        </AppPanel.Header>

        <AppPanel.Section>
          <AppPanel.SectionHead>
            {agent.data.engine.displayName}
            <Button variant="ghost" size="icon" className="">
              <Pencil1Icon />
            </Button>
          </AppPanel.SectionHead>

          <AppPanel.SectionBody>
            <EngineCard engine={agent.data.engine} />
          </AppPanel.SectionBody>
        </AppPanel.Section>

        <AppPanel.Section>
          <AppPanel.SectionHead>
            Parameters
            <Button
              variant={paramEditMode ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setParamEditMode(!paramEditMode)}
            >
              <Pencil1Icon />
            </Button>
          </AppPanel.SectionHead>

          <AppPanel.SectionBody>
            <SectionInferenceParameters editMode={paramEditMode} />
          </AppPanel.SectionBody>
        </AppPanel.Section>
      </AppPanel>

      {/* <div className="flex flex-col gap-4 overflow-y-auto border-r-2 px-6 pt-4">
        <AgentCard agent={agent.data} className="" />
        
      </div> */}

      {/* Chat */}
      <InferenceBuffer agent={agent.data} className="col-span-2 overflow-y-auto" />
    </AgentShell>
  )
}
