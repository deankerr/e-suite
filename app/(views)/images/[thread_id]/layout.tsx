import { ThreadHeader } from '@/components/_v/ThreadHeader'

// export const metadata = {
//   title: '',
// }

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { thread_id: string }
}) {
  return (
    <>
      <ThreadHeader thread_id={params.thread_id} />
      {children}
    </>
  )
}
