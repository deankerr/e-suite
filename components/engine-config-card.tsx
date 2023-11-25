import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useEditableCardContext } from './deck'
import { EngineCard } from './engine-card'
import { EngineSelect } from './engine-select'
import { useGetAgentDetail, useGetEngineDetail, useUpdateAgent } from './queries'
import { Loading } from './ui/loading'

export function EngineConfigCard({
  agentId = '',
}: { agentId?: string } & React.ComponentProps<'div'>) {
  const { isEditing } = useEditableCardContext()

  const agent = useGetAgentDetail(agentId)
  const [engineSelectValue, setEngineSelectValue] = useState('')
  const engineSelectData = useGetEngineDetail(engineSelectValue)

  const agentMutation = useUpdateAgent(agent.data?.id)

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
