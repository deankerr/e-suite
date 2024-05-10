import { GlobalThreadPage } from '@/components/pages/GlobalThreadPage'

export default function Page({ params: { trid } }: { params: { trid: string } }) {
  return <GlobalThreadPage rid={trid} />
}
