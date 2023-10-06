import { ChatBubbleLeftRightIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function HeaderBar({
  addMessages,
  clearMessages,
}: {
  addMessages: () => void
  clearMessages: () => void
}) {
  return (
    <div className="navbar w-auto flex-none rounded-b-md bg-primary text-primary-content shadow-lg">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl normal-case">ai.chat</a>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <div className="btn btn-ghost" onClick={addMessages}>
          <ChatBubbleLeftRightIcon className="w-8" />
        </div>
        <div className="btn btn-ghost" onClick={clearMessages}>
          <XCircleIcon className="w-8" />
        </div>
      </div>
    </div>
  )
}
