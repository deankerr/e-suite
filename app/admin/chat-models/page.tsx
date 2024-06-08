'use client'

import { Card, Heading, Tabs } from '@radix-ui/themes'
import { omit } from 'convex-helpers'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import { z } from 'zod'

import AnthropicLogo from '@/assets/logos/anthropic.svg'
import CohereLogo from '@/assets/logos/cohere.svg'
import GoogleLogo from '@/assets/logos/google.svg'
import MetaLogo from '@/assets/logos/meta.svg'
import MistralAiLogo from '@/assets/logos/mistral.svg'
import OpenAiLogo from '@/assets/logos/openai.svg'
import { api } from '@/convex/_generated/api'
import { chatModelFields } from '@/convex/schema'

import type { Doc } from '@/convex/_generated/dataModel'

export default function Page() {
  const cacheData = useQuery(api.db.chatModels.getLatestCacheData, {})
  const openrouterData = parseOpenRouterData(cacheData?.openrouter)
  const togetherData = parseTogetherData(cacheData?.together)

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex max-h-[85vh] gap-3 overflow-hidden">
        <CacheDataView data={openrouterData} />
        <CacheDataView data={togetherData} />
      </div>

      <div className="flex flex-col gap-3">
        <Image src={AnthropicLogo} alt="" />
        <Image src={CohereLogo} alt="" />
        <Image src={GoogleLogo} alt="" />
        <Image src={MetaLogo} alt="" />
        <Image src={MistralAiLogo} alt="" />
        <Image src={OpenAiLogo} alt="" />
      </div>
    </div>
  )
}

const CacheDataView = ({ data }: { data?: ParsedCacheData }) => {
  if (!data) return null
  return (
    <Card className="flex flex-1 flex-col rounded-lg bg-gray-2 p-3">
      <Heading size="3">
        {data.endpoint} / {data.name}
      </Heading>

      <Tabs.Root defaultValue="parsed" className="flex grow flex-col overflow-hidden">
        <Tabs.List className="shrink-0">
          <Tabs.Trigger value="raw">raw</Tabs.Trigger>
          <Tabs.Trigger value="parsed">parsed</Tabs.Trigger>
        </Tabs.List>

        <div className="grow overflow-x-auto overflow-y-auto">
          <Tabs.Content value="raw">
            <pre className="h-full overflow-x-auto overflow-y-auto bg-gray-1 p-1 font-mono text-xs">
              {data.data}
            </pre>
          </Tabs.Content>

          <Tabs.Content value="parsed">
            <pre className="h-full overflow-x-auto overflow-y-auto bg-gray-1 p-1 font-mono text-xs">
              {JSON.stringify(data.parsed, null, 2)}
            </pre>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </Card>
  )
}

type ParsedCacheData = Doc<'endpointDataCache'> & {
  filtered: Record<string, any>[]
  parsed: ChatModelData[]
}

function parseOpenRouterData(cacheData?: Doc<'endpointDataCache'>): ParsedCacheData | undefined {
  if (!cacheData) return undefined
  const filterIds = ['openrouter/auto']
  const json = JSON.parse(cacheData.data).data as Record<string, any>[]
  const filtered = json.filter((d) => !filterIds.includes(d.id))

  const parsed = filtered
    .map((d) =>
      getChatModelShape({
        slug: d.id,
        name: d.name,
        description: d.description,

        creatorName: '',
        link: '',
        license: '',
        tags: [],

        numParameters: -1,
        contextLength: d.context_length,
        maxOutputTokens: -1,
        tokenizer: d.architecture.tokenizer,
        stop: [],

        endpoints: [
          {
            endpoint: 'openrouter',
            model: d.id,
            pricing: {},
            modelDataSource: JSON.stringify(d, null, 2),
          },
        ],
      }),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return {
    ...cacheData,
    filtered,
    parsed,
  }
}

function parseTogetherData(cacheData?: Doc<'endpointDataCache'>): ParsedCacheData | undefined {
  if (!cacheData) return undefined
  const json = JSON.parse(cacheData.data) as Record<string, any>[]
  const filtered = json
    .map((d) =>
      omit(d, [
        '_id',
        'modelInstanceConfig',
        'hardware_label',
        'show_in_playground',
        'isFeaturedModel',
        'instances',
        'access',
        'depth',
        'pricing_tier',
      ]),
    )
    .filter((d) => d.display_type === 'chat')

  const parsed = filtered
    .map((d) =>
      getChatModelShape({
        slug: d.name,
        name: d.display_name,
        description: d.description,
        creatorName: d.create_organization,

        link: d.link,
        license: d.license,
        tags: [],

        numParameters: d.num_parameters,
        contextLength: d.context_length,
        maxOutputTokens: -1,
        tokenizer: '',
        stop: d.config?.stop ?? [],

        endpoints: [
          {
            endpoint: 'together',
            model: d.name,
            pricing: {},
            modelDataSource: JSON.stringify(d, null, 2),
          },
        ],
      }),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return {
    ...cacheData,
    filtered,
    parsed,
  }
}

const chatModelSchema = z.object(chatModelFields)
type ChatModelData = z.infer<typeof chatModelSchema>
function getChatModelShape(data: ChatModelData): ChatModelData {
  return data
}
