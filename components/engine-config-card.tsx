import { useAgentDetail, useAgentMutation, useEngine } from '@/components/queries-reloaded'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useEditableCardContext } from './deck'
import { EngineCard } from './engine-card'
import { EngineSelect } from './engine-select'
import { Loading } from './ui/loading'

export function EngineConfigCard({
  agentId = '',
}: { agentId?: string } & React.ComponentProps<'div'>) {
  const { isEditing } = useEditableCardContext()

  const agent = useAgentDetail(agentId)
  const [engineSelectValue, setEngineSelectValue] = useState('')
  const engineSelectData = useEngine(engineSelectValue)

  const agentMutation = useAgentMutation(agent.data?.id)

  if (
    engineSelectValue &&
    !isEditing &&
    agent.data?.engineId !== engineSelectValue &&
    (agentMutation.isIdle || agentMutation.isSuccess)
  ) {
    agentMutation.mutate({ engineId: engineSelectValue })
  }

  if (!agent.data) return <Loading />
  return (
    <>
      <h3>{isEditing ? 'Model' : agent.data.engine.displayName}</h3>
      {isEditing && (
        <EngineSelect
          value={engineSelectValue}
          setValue={setEngineSelectValue}
          className="mx-auto"
        />
      )}
      <EngineCard
        engine={isEditing ? engineSelectData.data ?? agent.data.engine : agent.data.engine}
      />
    </>
  )
}
