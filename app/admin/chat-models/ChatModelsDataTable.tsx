import { useState } from 'react'
import { Badge, Table } from '@radix-ui/themes'
import fuzzysort from 'fuzzysort'

import { BohSearchInput } from '@/components/ui/form'
import { cn } from '@/lib/utils'

import type { EChatModel } from '@/convex/shared/shape'
import type { ButtonProps } from '@radix-ui/themes'

type ChatModelsDataTableProps = { models: EChatModel[] | undefined } & React.ComponentProps<'div'>

export const ChatModelsDataTable = ({ models, className, ...props }: ChatModelsDataTableProps) => {
  const [searchValue, setSearchValue] = useState('')

  const result = fuzzysort.go(searchValue, models ?? [], {
    keys: ['slug', 'name', 'creatorName'],
    all: true,
    threshold: 0.5,
  })

  return (
    <div {...props} className={cn('space-y-2', className)}>
      <div className="wt-title-3">Chat Models</div>
      <BohSearchInput
        placeholder="filter..."
        value={searchValue}
        onValueChange={setSearchValue}
        className="max-w-60"
      />

      <Table.Root size="1">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell justify="end">endpoint/model</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>slug</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result.map(({ obj }) => {
            const { endpoints, name, slug, rest } = splitProperties(obj)
            return (
              <Table.Row key={obj._id}>
                <Table.Cell className="text-xs" justify="end">
                  {endpoints.map((e) => (
                    <div key={e.endpoint} className="gap-2 text-right font-mono flex-end">
                      {e.model}
                      <EndpointBadge endpoint={e.endpoint} className="w-20 justify-center" />
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell className="text-xs">{name}</Table.Cell>
                <Table.Cell className="text-xs">{slug}</Table.Cell>
                {rest.map(([key, value]) => {
                  if (key === 'description' && typeof value === 'string') {
                    return (
                      <Table.Cell className="text-xs" key={key}>
                        {value ? value.slice(0, 100) : ''}
                      </Table.Cell>
                    )
                  }
                  return (
                    <Table.Cell className="text-xs" key={key} maxWidth="200px">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

const splitProperties = (obj: EChatModel) => {
  const { endpoints, name, slug, _id, _creationTime, ...rest } = obj
  return {
    endpoints,
    name,
    slug,
    _id,
    rest: Object.entries(rest),
  }
}

export const EndpointBadge = ({
  endpoint,
  ...props
}: { endpoint: string } & React.ComponentProps<typeof Badge>) => {
  const endpointColors: Record<string, ButtonProps['color']> = {
    openrouter: 'red',
    openai: 'green',
    together: 'iris',
  }

  return (
    <Badge size="1" color={endpointColors[endpoint]} {...props}>
      {endpoint}
    </Badge>
  )
}
