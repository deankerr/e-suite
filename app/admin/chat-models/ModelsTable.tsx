import { Table } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

import type { EChatModel } from '@/convex/types'

export const ModelsTable = ({
  models,
  className,
  ...props
}: { models: EChatModel[] } & React.ComponentProps<'div'>) => {
  const byScore = models.toSorted((a, b) => b.internalScore - a.internalScore)
  return (
    <div {...props} className={cn('overflow-x-auto', className)}>
      <Table.Root size="1" variant="surface" layout="fixed">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell maxWidth="240px">resourceKey</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell maxWidth="360px">name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>internalScore</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>tags</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>creatorName</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>pricing</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {byScore.map((model) => (
            <Table.Row key={model._id}>
              <Table.Cell maxWidth="240px" className="break-all font-mono text-xs">
                {model.resourceKey}
              </Table.Cell>
              <Table.Cell maxWidth="360px">{model.name}</Table.Cell>
              <Table.Cell>{model.internalScore}</Table.Cell>
              <Table.Cell>
                {model.tags.join(', ') || <span className="italic text-gray-10">none</span>}
              </Table.Cell>
              <Table.Cell>{model.creatorName}</Table.Cell>
              <Table.Cell className="font-mono text-xs">{JSON.stringify(model.pricing)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
