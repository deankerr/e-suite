import { ThreadHeader } from '@/components/_v/ThreadHeader'

// export const metadata = {
//   title: '',
// }

export default function Layout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  params: { thread_id: string }
}) {
  return (
    <>
      <ThreadHeader thread_id={params.thread_id} />
      {children}
      {modal}
    </>
  )
}
