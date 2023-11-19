'use client'

import type { Agent } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { NodeRendererProps, Tree } from 'react-arborist'
import { Loading } from '../ui/loading'
import { useAgents, usePathnameFocusedAgentId } from './queries-reloaded'

export function NavTree({ className, children }: React.ComponentProps<'div'>) {
  const agents = useAgents()

  const agentTree = agents.data ? buildNodeTree(agents.data) : null
  const pathname = usePathname()

  const router = useRouter()
  return (
    <div className={cn('', className)}>
      {agents.isLoading && <Loading />}
      {agents.error && agents.error.message}
      {agentTree && (
        <div className="px-6 py-3">
          <Tree
            initialData={agentTree}
            className=""
            rowHeight={32}
            padding={12}
            width="100%"
            height={250}
            onActivate={(node) => {
              if (node.children) return
              console.log('active', node.id)

              router.push(`/ui/${node.id}`)
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
  const focusedId = usePathnameFocusedAgentId()
  const isFocusedAgent = focusedId === node.data.id

  return (
    <div
      style={style}
      ref={dragHandle}
      className={cn(
        'flex h-full items-center',
        isFolder ? 'font-medium' : 'text-foreground/80',
        node.isFocused && !isFolder && 'border',
        isFocusedAgent && 'rounded-md bg-primary text-primary-foreground',
      )}
      onClick={() => node.focus()}
    >
      {node.data.name}
    </div>
  )
}

function buildNodeTree(agents: Agent[]) {
  return [{ id: '1', name: 'Agents', children: agents }]
}
