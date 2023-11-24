'use client'

import { AppPanel } from '@/components/app-panel'
import { EngineCard } from '@/components/engine-card'
import { EngineSelect } from '@/components/engine-select'
import { InferenceBuffer } from '@/components/inference-buffer/inference-buffer'
import { useAgentDetail, useAgentMutation, useEngine } from '@/components/queries-reloaded'
import { SectionInferenceParameters } from '@/components/section-inference-parameters'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { useState } from 'react'

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agentSlug = params.slug
  const agent = useAgentDetail(agentSlug)

  const [paramEditMode, setParamEditMode] = useState(false)

  const [engineEditMode, setEngineEditMode] = useState(false)
  const [engineSelectValue, setEngineSelectValue] = useState('')
  const engineSelectData = useEngine(engineSelectValue)

  const agentMutation = useAgentMutation(agent.data?.id)

  if (!agent.data) return <p>No agent?</p>

  return (
    <>
      {/* Details */}
      <AppPanel className="w-full max-w-md border">
        <AppPanel.Header imageStart={'/' + agent.data.image}>
          <h2 className={cn('py-2 text-lg font-semibold leading-none')}>
            {agentMutation.isPending && <Loading size="sm" className="mx-3" />}
            {agent.data.name}
          </h2>
        </AppPanel.Header>

        <AppPanel.Section>
          <AppPanel.SectionHead>
            {engineEditMode ? (
              <EngineSelect
                value={engineSelectValue}
                setValue={setEngineSelectValue}
                className="-ml-2 px-1.5 text-base"
              />
            ) : (
              agent.data.engine.displayName
            )}
            <Button
              variant={engineEditMode ? 'default' : 'ghost'}
              size="icon"
              onClick={() => {
                if (engineEditMode) {
                  if (agent.data.engineId !== engineSelectValue) {
                    agentMutation.mutate({
                      ...agent.data,
                      engineId: engineSelectValue,
                    })
                  }
                } else {
                  setEngineSelectValue(agent.data.engineId)
                }
                setEngineEditMode(!engineEditMode)
              }}
            >
              <Pencil1Icon />
            </Button>
          </AppPanel.SectionHead>

          <AppPanel.SectionBody>
            <EngineCard engine={engineEditMode ? engineSelectData.data : agent.data.engine} />
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

      {/* Chat */}
      <InferenceBuffer agent={agent.data} className="col-span-2 overflow-y-auto" />
    </>
  )
}
