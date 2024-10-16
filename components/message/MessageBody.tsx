import { Code } from '@radix-ui/themes'

import { useMessageTextStream } from '@/app/lib/api/threads'
import { cn } from '@/app/lib/utils'
import { Markdown } from '../markdown/Markdown'
import { Loader } from '../ui/Loader'
import { MessageEditor } from './MessageEditor'
import { useMessageContext } from './MessageProvider'

import type { EMessage } from '@/convex/types'

export const MessageBody = () => {
  const { message, run, isEditing, showJson, textStyle } = useMessageContext()

  const isHidden = message.channel === 'hidden'
  const isActive = run?.status === 'active'
  const isStreaming = run?.stream && !message.text
  const textStream = useMessageTextStream(isStreaming ? run._id : undefined)
  const text = message.text ?? textStream

  return (
    <div className={cn('flex shrink-0 flex-col', isHidden && 'opacity-30')}>
      {showJson ? <MessageJson message={message} /> : null}

      <div className="min-h-12 p-3">
        {isEditing ? <MessageEditor /> : <MessageText textStyle={textStyle}>{text}</MessageText>}

        {isActive && !text && (
          <div className="flex-start h-8">
            <Loader type="dotPulse" size={32} />
          </div>
        )}

        {!isActive && message.text === '' && (
          <Code variant="ghost" color="gray">
            (blank message)
          </Code>
        )}

        {run?.status === 'failed' && (
          <Code variant="ghost" color="red">
            Error: generation failed.
          </Code>
        )}
      </div>
    </div>
  )
}

const MessageText = ({
  children,
  textStyle,
}: {
  children: string | undefined
  textStyle: 'markdown' | 'monospace'
}) => {
  if (!children) return null
  if (textStyle === 'markdown') return <Markdown>{children}</Markdown>
  return (
    <div className="whitespace-pre-wrap font-mono font-[15px] leading-7 text-gray-11">
      {children}
    </div>
  )
}

const MessageJson = ({ message }: { message: EMessage }) => {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap bg-blackA-3 p-3.5 leading-6 text-gray-11">
      {JSON.stringify(message, null, 2)}
    </pre>
  )
}
