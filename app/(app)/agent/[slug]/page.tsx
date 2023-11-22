'use client'

import { AgentCard } from '@/components/agent-card'
import { AgentShell } from '@/components/agent-shell'
import { EngineCard } from '@/components/engine-card'
import { InferenceBuffer } from '@/components/inference-buffer/inference-buffer'
import { InferenceParameters } from '@/components/inference-parameters/Inference-parameters'
import { useAgentDetail } from '@/components/queries-reloaded'

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agentSlug = params.slug
  const agent = useAgentDetail(agentSlug)

  if (!agent.data) return <p>No agent?</p>

  return (
    <AgentShell className="grid grid-cols-2 overflow-hidden">
      {/* Details */}
      <div className="flex flex-col gap-4 overflow-y-auto border-r-2 px-6">
        <AgentCard agent={agent.data} className="" />
        <EngineCard engine={agent.data.engine} />
        <InferenceParameters className="max-w-sm rounded-md border-2" />
      </div>

      {/* Chat */}
      <InferenceBuffer agent={agent.data} className="overflow-y-auto" />
    </AgentShell>
  )
}
