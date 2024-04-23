import { ThreadPageView } from '@/components/pages/ThreadPageView'

export default function ThreadId({ params: { slugId } }: { params: { slugId: string } }) {
  return <ThreadPageView slugId={slugId} />
}
