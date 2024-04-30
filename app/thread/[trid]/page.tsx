import { ThreadPage } from '@/components/pages/ThreadPageView'

export default function Page({ params: { trid } }: { params: { trid: string } }) {
  return <ThreadPage rid={trid} />
}
