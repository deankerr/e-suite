'use client'

import { Table } from '@radix-ui/themes'

import { chatModels } from '@/convex/shared/models'

export default function Page() {
  // sort by name alphabetically
  const models = chatModels.toSorted((a, b) => a.endpointModelId.localeCompare(b.endpointModelId))
  return (
    <div className="p-2">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>☁️</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Context Length</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {models.map((model) => (
            <Table.Row key={model.endpointModelId}>
              <Table.Cell style={{ color: stringToHex(model.endpoint) }}>
                {endpointCode(model.endpoint)}
              </Table.Cell>
              <Table.Cell>{model.endpointModelId}</Table.Cell>
              <Table.Cell>{model.contextLength}</Table.Cell>
              <Table.Cell>{model.name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {/* {models.map((model) => (
        <div key={model.endpointModelId} className="font-mono text-xs">
          <span style={{ color: stringToHex(model.endpoint) }}>
            [{model.endpoint.slice(0, 2)}]
          </span> {model.endpointModelId}
        </div>
      ))} */}
    </div>
  )
}

function stringToHex(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

function endpointCode(endpoint: string) {
  switch (endpoint) {
    case 'openai':
      return 'OA'
    case 'openrouter':
      return 'OR'
    case 'together':
      return 'TA'
    default:
      return endpoint.slice(0, 2)
  }
}
