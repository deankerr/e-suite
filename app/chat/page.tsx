import { ThemePicker } from '../components/ThemeToggle'
import { Chat } from './Chat'

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <Chat />
      <div className="fixed left-2 top-2">
        <ThemePicker />
      </div>
    </div>
  )
}
