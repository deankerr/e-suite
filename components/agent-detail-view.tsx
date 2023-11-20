import { cn } from '@/lib/utils'
import { AgentDetailPanel } from './suite/agent-detail-panel'

export function AgentDetailView({ className }: React.ComponentProps<'div'>) {
  return AgentDetailPanel
  // return (
  //  <div className={cn('', className)}>
  //    <div>AgentDetailView</div>
  //  </div>
  // )
}
