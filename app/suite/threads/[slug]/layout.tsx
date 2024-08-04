import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `Threads · %s`,
    default: `Threads`,
  },
}

export default function Layout({
  children,
  thread,
  message,
}: {
  children: React.ReactNode
  thread: React.ReactNode
  message: React.ReactNode
}) {
  return (
    <>
      {thread}
      {message}
      {children}
    </>
  )
}
