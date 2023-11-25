'use client'

import { Deck } from '@/components/deck'
import { EngineConfigCard } from '@/components/engine-config-card'
import { InferenceBuffer } from '@/components/inference-buffer/inference-buffer'
import { InferenceParametersCard } from '@/components/inference-parameters-card'
import { useGetAgentDetail } from '@/components/queries'

export default function AgentSlugPage({ params }: { params: { slug: string } }) {
  const agentSlug = params.slug
  const agent = useGetAgentDetail(agentSlug)

  if (!agent.data) return <p>No agent?</p>

  return (
    <>
      <Deck className="w-full max-w-md">
        <Deck.AvatarCard imageSrc={'/' + agent.data.image}>
          <h2>{agent.data.name}</h2>
        </Deck.AvatarCard>

        <Deck.EditableCard>
          <EngineConfigCard agentId={agent.data.id} />
        </Deck.EditableCard>

        <Deck.EditableCard>
          <InferenceParametersCard />
        </Deck.EditableCard>
      </Deck>

      {/* Chat */}
      {/* <InferenceBuffer agent={agent.data} className="col-span-2 overflow-y-auto" /> */}
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
