'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SyntaxHighlighter } from './syntax-highlighter'

export default function Markdown({ children }: { children: string | null | undefined }) {
  if (!children) return <div></div>

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
            <pre className={cn(className, 'contents')} {...props}>
              {children}
            </pre>
          )
        },
        table: ({ node, ref, ...props }) => <Table {...props} className="not-prose" />,
        thead: ({ node, ref, ...props }) => <TableHeader {...props} />,
        tbody: ({ node, ref, ...props }) => <TableBody {...props} />,
        tfoot: ({ node, ref, ...props }) => <TableCaption {...props} />,
        tr: ({ node, ref, ...props }) => <TableRow {...props} />,
        th: ({ node, ref, ...props }) => <TableHead {...props} />,
        td: ({ node, ref, ...props }) => <TableCell {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
