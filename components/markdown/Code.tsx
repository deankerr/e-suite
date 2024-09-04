import { memo } from 'react'
import { Code as RadixCode } from '@radix-ui/themes'
import { Highlight, themes } from 'prism-react-renderer'

const CodeHighlighter = ({ children, className, ...props }: React.ComponentProps<'code'>) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match?.[1]
  if (!language) return <RadixCode color="gray">{children}</RadixCode>

  const code = children?.toString()
  if (!code) return null

  return (
    <Highlight theme={themes.gruvboxMaterialDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code
          style={style}
          className={`overflow-auto whitespace-pre rounded-md p-2 ${className}`}
          {...props}
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
}

export const Code = memo(CodeHighlighter)
