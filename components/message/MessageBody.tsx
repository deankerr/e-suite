import { Code } from '@radix-ui/themes'

import { Markdown } from '../markdown/Markdown'
import { Loader } from '../ui/Loader'
import { MessageEditor } from './MessageEditor'
import { useMessageContext } from './MessageProvider'

import type { EMessage } from '@/convex/types'

export const MessageBody = () => {
  const { message, isEditing, showJson, textStyle } = useMessageContext()

  if (!message) return null

  return (
    <div className="flex shrink-0 flex-col bg-gray-2">
      <div className="min-h-14">
        {showJson ? <MessageJson message={message} /> : null}
        {isEditing ? <MessageEditor /> : <MessageText text={message.text} textStyle={textStyle} />}

        {message.text === undefined && (
          <div className="flex-start w-full gap-4 p-4">
            <Loader type="dotPulse" />
          </div>
        )}

        {message.text === '' && (
          <div className="p-3.5">
            <Code variant="ghost" color="gray">
              (blank message)
            </Code>
          </div>
        )}
      </div>
    </div>
  )
}

const MessageText = ({
  text,
  textStyle,
}: {
  text: string | undefined
  textStyle: 'markdown' | 'monospace'
}) => {
  if (textStyle === 'markdown') {
    return (
      <div className="markdown-root p-3.5 text-base">
        <Markdown>{text}</Markdown>
      </div>
    )
  }

  return (
    <pre className="mb-4 overflow-x-auto whitespace-pre-wrap p-4 text-gray-11 sm:text-[15px] sm:leading-6">
      {text}
    </pre>
  )
}

const MessageJson = ({ message }: { message: EMessage }) => {
  return (
    <pre className="jetbrains mb-4 overflow-x-auto whitespace-pre-wrap bg-blackA-3 p-4 text-gray-11">
      {JSON.stringify(message, null, 2)}
    </pre>
  )
}
