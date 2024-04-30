import { ThreadPage } from '@/components/pages/ThreadPage'

export default function Page({ params: { trid } }: { params: { trid: string } }) {
  return <ThreadPage rid={trid} />
}
