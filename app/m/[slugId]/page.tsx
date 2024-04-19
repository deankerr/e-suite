import { MessagePage } from './MessagePage'

export const metadata = {
  title: 'e/suite / Message',
}

export default function MessageSlugIdPage({ params: { slugId } }: { params: { slugId: string } }) {
  // MessagePage

  return <MessagePage slugId={slugId} />
}
