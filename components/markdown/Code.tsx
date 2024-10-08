import { memo } from 'react'
import { Code as RadixCode } from '@radix-ui/themes'
import { Highlight, themes } from 'prism-react-renderer'

const MemoizedHighlight = memo(
  (props: Omit<React.ComponentProps<typeof Highlight>, 'children'>) => {
    return (
      <Highlight theme={themes.gruvboxMaterialDark} {...props}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <code
            style={style}
            className={`overflow-auto whitespace-pre rounded-md p-2 ${className}`}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        )}
      </Highlight>
    )
  },
)
MemoizedHighlight.displayName = 'MemoizedHighlight'

const CodeHighlighter = ({ children, className }: React.ComponentProps<'code'>) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match?.[1] ?? ''

  const code = children?.toString().replace(/\n$/, '')
  if (!code) return null
  if (!language && !code.includes('\n')) return <RadixCode>{code}</RadixCode>

  return <MemoizedHighlight code={code} language={language} />
}

export const Code = memo(CodeHighlighter)
