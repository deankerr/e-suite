import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Component = (props: { text?: string }) => {
  if (!props.text) return null

  return (
    <ReactMarkdown
      components={{
        code(props) {
          const { children, className, node, ref, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter {...rest} PreTag="div" language={match[1]} style={tomorrow}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
      }}
    >
      {props.text}
    </ReactMarkdown>
  )
}

export const Markdown = memo(Component)
