import { Code, DataList } from '@radix-ui/themes'

import type { MessageContent } from '@/convex/external'

type GenerationDataListProps = {
  generations: NonNullable<MessageContent['generations']>
  orientation?: 'horizontal' | 'vertical'
}

export const GenerationDataList = ({
  generations,
  orientation = 'vertical',
}: GenerationDataListProps) => {
  const first = generations[0]
  if (!first) return null

  return (
    <DataList.Root orientation={orientation}>
      <DataList.Item>
        <DataList.Label>model id</DataList.Label>
        <DataList.Value>
          <div className="gap-2 flex-start">
            <Code color="gray">{first.model_id}</Code>
          </div>
        </DataList.Value>
      </DataList.Item>

      {/* <DataList.Item>
        <DataList.Label>dimensions</DataList.Label>
        <DataList.Value>
          <div className="grid gap-0.5">

          </div>
        </DataList.Value>
      </DataList.Item> */}

      <DataList.Item>
        <DataList.Label>prompt</DataList.Label>
        <DataList.Value>{first.prompt}</DataList.Value>
      </DataList.Item>

      {/* {unordered.map(([key, value]) => (
        <DataList.Item key={key}>
          <DataList.Label>{key}</DataList.Label>
          <DataList.Value>
            {typeof value === 'number' ? <Code color="gold">{value}</Code> : value}
          </DataList.Value>
        </DataList.Item>
      ))} */}

      <DataList.Item>
        <DataList.Label>created</DataList.Label>
        <DataList.Value>
          <Code color="gold">{new Date(first._creationTime).toLocaleString()}</Code>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  )
}
