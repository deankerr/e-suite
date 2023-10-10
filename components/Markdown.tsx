import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SyntaxHighlighter } from './syntax-highlighter'

export function Markdown({ children }: { children: string | null | undefined }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ children, className, node, ...rest }) {
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter language={match[1]}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
        pre({ children, className, node, ...props }) {
          return (
            <pre className={cn(className, 'not-prose max-w-[65ch] rounded-md')} {...props}>
              {children}
            </pre>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
