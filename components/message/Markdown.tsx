import './syntax.css'

import { memo } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useSetAtom } from 'jotai'
import ReactMarkdown from 'react-markdown'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { htmlTextAtom } from '@/components/artifacts/atoms'
import { LinkBadge } from '@/components/message/LinkBadge'
import { IconButton } from '@/components/ui/Button'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'

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
        pre: ({ node, ...props }) => <Pre {...props} />,
      }}
    >
      {props.text}
    </ReactMarkdown>
  )
}

export const Markdown = memo(Component)

const Pre = ({ children, ...props }: React.ComponentProps<'pre'>) => {
  let text = ''

  if (children && typeof children === 'object' && 'props' in children) {
    if (children.props.children && typeof children.props.children === 'string') {
      text = children.props.children
    }
  }

  return (
    <pre {...props}>
      {children}
      <div className="absolute right-2 top-2 space-x-2">
        <AdminOnlyUi>
          <CopyToHTMLArtifactButton text={text} />
        </AdminOnlyUi>
        <CopyToClipboardButton text={text} />
      </div>
    </pre>
  )
}

const CopyToClipboardButton = ({ text }: { text: string }) => {
  return (
    <IconButton
      aria-label="Copy to clipboard"
      onClick={() => navigator.clipboard.writeText(text)}
      variant="soft"
      disabled={!text}
    >
      <Icons.Copy size={18} />
    </IconButton>
  )
}

const CopyToHTMLArtifactButton = ({ text }: { text: string }) => {
  const setHtmlText = useSetAtom(htmlTextAtom)

  return (
    <IconButton aria-label="Copy to HTML artifact" onClick={() => setHtmlText(text)} variant="soft">
      <Icons.FileHtml size={18} />
    </IconButton>
  )
}
