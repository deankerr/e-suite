import { Code, DataList } from '@radix-ui/themes'

import type { Doc } from '@/convex/_generated/dataModel'
import type { ImageModel } from '@/convex/types'

type GenerationDataListProps = { generation: Doc<'generations'>; model: ImageModel }

export const GenerationDataList = ({ generation, model }: GenerationDataListProps) => {
  const { model_id, prompt, width, height, n, _creationTime, ...rest } = generation
  const unordered = Object.entries(rest)

  return (
    <DataList.Root orientation="vertical">
      <DataList.Item>
        <DataList.Label>model id</DataList.Label>
        <DataList.Value>
          {model.name}
          <Code color="gold">{model_id}</Code>
        </DataList.Value>
      </DataList.Item>

      <DataList.Item>
        <DataList.Label>dimensions</DataList.Label>
        <DataList.Value>
          <Code color="gold">
            {width} x {height} ({n})
          </Code>
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
