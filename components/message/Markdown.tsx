import './syntax.css'

import { memo } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import ReactMarkdown from 'react-markdown'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { LinkBadge } from '@/components/message/LinkBadge'
import { IconButton } from '@/components/ui/Button'

const Component = (props: { text?: string }) => {
  if (!props.text) return null

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ color: _, ...props }) => <LinkBadge {...props} href={props.href ?? ''} />,
        code(props) {
          const { children, className, node, ref, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...rest}
              language={match[1]}
              style={{}}
              useInlineStyles
              customStyle={{
                margin: 0,
                padding: 0,
                fontFamily: 'unset',
                fontSize: 'unset',
                lineHeight: 'unset',
                backgroundColor: '#1D1F21',
              }}
              codeTagProps={{ style: {} }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
        pre: ({ children, node, ...props }) => {
          return (
            <pre {...props}>
              {children}
              <CopyToClipboardButton code={children} />
            </pre>
          )
        },
      }}
    >
      {props.text}
    </ReactMarkdown>
  )
}

export const Markdown = memo(Component)

const CopyToClipboardButton = ({ code }: { code: React.ReactNode }) => {
  let text = ''

  if (code && typeof code === 'object' && 'props' in code) {
    const { children } = code.props
    if (children && typeof children === 'string') {
      text = children
    }
  }

  return (
    <IconButton
      aria-label="Copy to clipboard"
      onClick={() => navigator.clipboard.writeText(text)}
      variant="soft"
      className="absolute right-2 top-2"
      disabled={!text}
    >
      <Icons.Copy size={18} />
    </IconButton>
  )
}
