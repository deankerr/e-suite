import { PatternsNavPanel } from '@/components/patterns/PatternNavPanel'

export const metadata = {
  title: 'Patterns',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PatternsNavPanel />
      {children}
    </>
  )
}
