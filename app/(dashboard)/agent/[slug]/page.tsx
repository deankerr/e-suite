'use client'

import { AvatarCard } from '@/components/avatar-card'
import { Deck } from '@/components/deck'
import { EngineDataCard } from '@/components/engine-data-card'
import { InferenceBuffer } from '@/components/inference-buffer/inference-buffer'
import { InferenceParametersCard } from '@/components/inference-parameters-card'
import { useGetAgentDetail } from '@/components/queries'
import { PrePrint } from '@/components/util/pre-print'

export default function AgentSlugPage({ params }: { params: { slug: string } }) {
  const agentSlug = params.slug
  const agent = useGetAgentDetail(agentSlug)

  if (!agent.data) return <p>No agent?</p>

  return (
    <>
      <Deck className="w-full max-w-md">
        <AvatarCard agent={agent.data} />

        <Deck.EditableCard>
          <EngineDataCard agent={agent.data} />
        </Deck.EditableCard>

        <Deck.EditableCard>
          <InferenceParametersCard agent={agent.data} />
        </Deck.EditableCard>
      </Deck>

      {/* Chat */}
      {/* <PrePrint>{agent.data}</PrePrint> */}
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
