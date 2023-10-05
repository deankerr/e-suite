import { ChatBubbleLeftRightIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { BarThemePicker } from './BarThemePicker'

export function HeaderBar({
  addMessages,
  clearMessages,
}: {
  addMessages: () => void
  clearMessages: () => void
}) {
  return (
    <div className="navbar mx-1 mt-1 w-auto flex-none rounded-xl bg-accent shadow-lg">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl normal-case text-accent-content">ai.chat</a>
      </div>
      <div className="navbar-center">
        <div className="btn btn-ghost" onClick={addMessages}>
          <ChatBubbleLeftRightIcon className="w-8 text-accent-content" />
        </div>
        <div className="btn btn-ghost" onClick={clearMessages}>
          <XCircleIcon className="w-8 text-accent-content" />
        </div>
      </div>
      <div className="navbar-end">
        <BarThemePicker />
      </div>
    </div>
  )
}
