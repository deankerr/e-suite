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

export default function AgentSlugPage({ params }: { params: { slug: string } }) {
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

/* ark tabs
   <div className="border-b pb-0.5">
        <Tabs.Root defaultValue={activeTab}>
          <Tabs.List className="">
            {tabs.map((t) => (
              <Tabs.Trigger key={t.value} value={t.value} asChild>
                <Button
                  variant="ghost"
                  className={cn('text-sm font-normal hover:bg-background')}
                  asChild
                >
                  <Link href={rootPath + '/' + (t.value === 'detail' ? '' : t.value)}>
                    {t.label}
                  </Link>
                </Button>
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator className="h-0.5 bg-primary" />
          </Tabs.List>
        </Tabs.Root>
      </div>
*/

/* 

function RenameDialog({
  children,
  current,
  onSubmit,
}: {
  children: React.ReactNode
  current: string
  onSubmit: (value: string) => unknown
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  const submit = () => {
    const value = ref.current?.value
    if (value) onSubmit(value)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Agent</DialogTitle>
          <DialogDescription>Rename Agent</DialogDescription> 
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="agent-name" className="sr-only">
                Name
              </Label>
              <Input ref={ref} id="agent-name" defaultValue={current} />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={submit}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
*/
