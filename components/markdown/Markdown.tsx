import { memo } from 'react'
import { Code } from '@radix-ui/themes'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { LinkBadge } from '@/components/message/LinkBadge'

export const Markdown = memo(({ children }: { children?: string | null | undefined }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ color, ...props }) => <LinkBadge {...props} href={props.href ?? ''} />,
        code: ({ color, ...props }) => <Code {...props} className="bg-transparent" />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
})

Markdown.displayName = 'Markdown'
