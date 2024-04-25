import { Code, DataList } from '@radix-ui/themes'

import SinkinModels from '@/convex/providers/sinkin.models.json'

import type { MessageContent } from '@/convex/external'

type GenerationDataListProps = { generation: NonNullable<MessageContent['generation']> }

export const GenerationDataList = ({ generation }: GenerationDataListProps) => {
  const { model_id, prompt, dimensions, _creationTime, _id, ...rest } = generation
  const unordered = Object.entries(rest)

  const model = SinkinModels.find((model) => model.id === model_id)
  return (
    <DataList.Root orientation="vertical">
      <DataList.Item>
        <DataList.Label>model id</DataList.Label>
        <DataList.Value>
          <div className="flex-start">
            {model?.name}
            <Code color="gold">{model_id}</Code>
          </div>
        </DataList.Value>
      </DataList.Item>

      <DataList.Item>
        <DataList.Label>dimensions</DataList.Label>
        <DataList.Value>
          <div className="grid gap-0.5">
            {dimensions.map(({ width, height, n }, i) => (
              <Code key={i} color="gold">
                {width}x{height} {n}
              </Code>
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
