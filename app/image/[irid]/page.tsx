import { GenerationPage } from '@/components/pages/GenerationPage'

export default function Page({ params: { irid: rid } }: { params: { irid: string } }) {
  return <GenerationPage rid={rid} />
}
