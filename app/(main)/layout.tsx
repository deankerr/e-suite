import { App } from './App'

export default function Layout({ children }: { children: React.ReactNode }) {
  // AppLayout
  return <App>{children}</App>
}
