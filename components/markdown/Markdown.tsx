import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { Code } from '@/components/markdown/Code'
import { Pre } from '@/components/markdown/Pre'
import { LinkBadge } from '@/components/message/LinkBadge'

const Component = (props: { text?: string }) => {
  if (!props.text) return null

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ color: _, ...props }) => <LinkBadge {...props} href={props.href ?? ''} />,
        code: ({ children, className }) => <Code className={className}>{children}</Code>,
        pre: ({ node, ...props }) => <Pre {...props} />,
      }}
    >
      {props.text}
    </ReactMarkdown>
  )
}

export const Markdown = memo(Component)
