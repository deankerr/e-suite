import { ThreadPageView } from '@/components/pages/ThreadPageView'

export default function ThreadId({ params: { trid } }: { params: { trid: string } }) {
  return <ThreadPageView rid={trid} />
}
