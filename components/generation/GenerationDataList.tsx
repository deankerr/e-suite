import { Code, DataList } from '@radix-ui/themes'
import * as R from 'remeda'
import { z } from 'zod'

import SinkinModels from '@/convex/providers/sinkin.models.json'
import { generationFields } from '@/convex/schema'

import type { MessageContent } from '@/convex/external'

type GenerationDataListProps = {
  generations: NonNullable<MessageContent['generations']>
  orientation?: 'horizontal' | 'vertical'
}

const om = R.mapToObj(
  ['result', 'metadata', 'model_id', 'width', 'height', 'prompt'] as const,
  (key) => [key, true as const],
)
const params = z.object(generationFields).omit(om)

export const GenerationDataList = ({
  generations,
  orientation = 'vertical',
}: GenerationDataListProps) => {
  const first = generations[0]
  if (!first) return null
  const { model_id, prompt, _creationTime, _id, ...rest } = first

  const dimensions = R.groupBy(generations, ({ width, height }) => `${width} x ${height}`)

  const unordered = Object.entries(params.parse(rest))
  const model = SinkinModels.find((model) => model.model_id === model_id)
  return (
    <DataList.Root orientation={orientation}>
      <DataList.Item>
        <DataList.Label>model id</DataList.Label>
        <DataList.Value>
          <div className="gap-2 flex-start">
            {model?.name}
            <Code color="gray">{model_id}</Code>
          </div>
        </DataList.Value>
      </DataList.Item>

      <DataList.Item>
        <DataList.Label>dimensions</DataList.Label>
        <DataList.Value>
          <div className="grid gap-0.5">
            {Object.entries(dimensions).map(([key, values]) => (
              <Code key={key} color="gold">{`${key} (${values.length})`}</Code>
            ))}
          </div>
        </DataList.Value>
      </DataList.Item>

      <DataList.Item>
        <DataList.Label>prompt</DataList.Label>
        <DataList.Value>{prompt}</DataList.Value>
      </DataList.Item>

      {unordered.map(([key, value]) => (
        <DataList.Item key={key}>
          <DataList.Label>{key}</DataList.Label>
          <DataList.Value>
            {typeof value === 'number' ? <Code color="gold">{value}</Code> : value}
          </DataList.Value>
        </DataList.Item>
      ))}

      <DataList.Item>
        <DataList.Label>created</DataList.Label>
        <DataList.Value>
          <Code color="gold">{new Date(_creationTime).toLocaleString()}</Code>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  )
}
