import { ComponentPropsWithoutRef, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { Code } from '@/components/markdown/Code'
import { Pre } from '@/components/markdown/Pre'
import { LinkBadge } from '@/components/message/LinkBadge'

export const Markdown = memo(({ children }: { children?: string | null | undefined }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ color: _, ...props }) => <LinkBadge {...props} href={props.href ?? ''} />,
        code: (props: ComponentPropsWithoutRef<'code'>) => <Code {...props} />,
        pre: (props: ComponentPropsWithoutRef<'pre'>) => <Pre {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
})

Markdown.displayName = 'Markdown'
