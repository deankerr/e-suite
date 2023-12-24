import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SyntaxHighlighter } from './SyntaxHighlighter'

export default function Markdown({
  className,
  children,
}: {
  className?: React.ComponentProps<'div'>['className']
  children: string | null | undefined
}) {
  if (!children) return <div></div>

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={className}
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
            <pre className={cn(className, 'contents')} {...props}>
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
