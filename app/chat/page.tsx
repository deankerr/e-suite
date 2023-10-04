import { ThemePicker } from '../components/ThemeToggle'
import { Chat } from './Chat'

export default function ChatPage() {
  return (
    <div className="h-[100dvh] overflow-hidden">
      <Chat />
      <div className="fixed left-2 top-2">
        <ThemePicker />
      </div>
    </div>
  )
}
