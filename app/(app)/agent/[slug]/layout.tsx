import { AgentViewLayout } from '@/components/agent-view-layout'

export default function AgentLayout({
  params,
  children,
}: {
  params: { slug: string }
  children: React.ReactNode
}) {
  // AgentViewLayout

  return <AgentViewLayout params={params.slug}>{children}</AgentViewLayout>
}
