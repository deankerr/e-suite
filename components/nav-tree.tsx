'use client'

import { cn } from '@/lib/utils'
import type { Agent } from '@/schema/user'
import { useParams, useRouter } from 'next/navigation'
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist'
import { useGetAgentList } from './queries'
import { Loading } from './ui/loading'

type Node = NodeApi & {}

export function NavTree({ className }: React.ComponentProps<'div'>) {
  const agents = useGetAgentList()
  const agentTree = agents.data ? buildNodeTree(agents.data) : null
  const router = useRouter()
  return (
    <div className={cn('', className)}>
      {agents.isLoading && <Loading />}
      {agents.error && agents.error.message}
      {agentTree && (
        <div className="px-6">
          <Tree
            initialData={agentTree}
            className=""
            rowHeight={32}
            padding={12}
            width="100%"
            height={250}
            onActivate={(node) => {
              if (node.children) return
              router.push(`/agent/${node.id}`)
            }}
          >
            {Node}
          </Tree>
        </div>
      )}
    </div>
  )
}

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  const isFolder = Array.isArray(node.children)
  const params = useParams()
  const isCurrentAgent = params?.slug === node.data.id

  return (
    <div
      style={style}
      ref={dragHandle}
      className={cn(
        'flex h-full items-center font-medium',
        isFolder && 'text-sm text-muted-foreground',
        !isFolder && 'cursor-pointer text-foreground/80 hover:text-foreground',
        isCurrentAgent && 'rounded-md bg-primary font-medium text-primary-foreground',
      )}
      // onClick={() => node.focus()}
    >
      {node.data.name}
    </div>
  )
}

function buildNodeTree(agents: Agent[]) {
  return [{ id: '1', name: 'Agents', children: agents }]
}
