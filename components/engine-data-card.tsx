import { cn } from '@/lib/utils'
import { Agent, Engine } from '@/schema/dto'
import { CheckIcon, Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { Deck } from './deck'
import { EngineDataGrid } from './engine-data-grid'
import { EngineSelectMenu } from './engine-select-menu'
import { useGetEngineList, useUpdateAgent } from './queries'
import { Button } from './ui/button'
import { Loading } from './ui/loading'

export function EngineDataCard({ agent }: { agent: Agent } & React.ComponentProps<'div'>) {
  const updateAgent = useUpdateAgent(agent.id)
  const isPending = updateAgent.isPending
  const [isEditing, setIsEditing] = useState(false)

  const engines = useGetEngineList()
  const [selectedEngine, setSelectedEngine] = useState(agent.engine)

  const currentEngineData =
    isEditing || isPending ? selectedEngine : engines.data?.find((e) => e.id === agent.engineId)

  return (
    <>
      <Deck.CardToolbar>
        {isEditing ? (
          <>
            <Button variant="secondary" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Cross2Icon />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                if (selectedEngine.id !== agent.engine.id && !updateAgent.isPending) {
                  updateAgent.mutate({ id: agent.id, engineId: selectedEngine.id })
                }
                setIsEditing(false)
              }}
            >
              <CheckIcon />
            </Button>
          </>
        ) : isPending ? (
          <Button variant="ghost" size="icon">
            <Loading size="xs" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil1Icon />
          </Button>
        )}
      </Deck.CardToolbar>

      <Deck.CardTitle>Model</Deck.CardTitle>

      <Deck.CardBody>
        <EngineSelectMenu
          engines={engines.data ?? [selectedEngine]}
          value={currentEngineData}
          onValueChange={(value) => setSelectedEngine(value)}
          className="w-full"
          editable={isEditing}
        />

        <EngineDataGrid engine={currentEngineData} className="px-2.5" />
      </Deck.CardBody>
    </>
  )
}
